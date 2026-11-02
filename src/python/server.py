import os
import signal
import socket
import subprocess
import threading
import time
import logging

import cv2
from flask import Flask, Response, jsonify
from flask_cors import CORS

from camera import Camera
from hand_detector import HandDetector
from firebase_service import FirebaseService
from stats import StatsTracker
from detection_engine import DetectionEngine

logger = logging.getLogger("GestureServer")


class GestureServer:
    def __init__(self, port=5002):
        self._port = port
        self._shutdown = threading.Event()

        self._camera = Camera()
        self._detector = HandDetector()
        self._firebase = FirebaseService()
        self._stats = StatsTracker()
        self._engine = DetectionEngine(
            self._camera, self._detector, self._firebase, self._stats
        )

        self._app = Flask(__name__)
        CORS(self._app)
        self._register_routes()

    def _register_routes(self):
        @self._app.route("/frame.jpg")
        def frame():
            display = self._engine.display_frame
            if display is None:
                return "", 204
            ret, buffer = cv2.imencode(".jpg", display, [cv2.IMWRITE_JPEG_QUALITY, 65])
            if not ret:
                return "", 500
            return Response(buffer.tobytes(), mimetype="image/jpeg")

        @self._app.route("/detection_data")
        def detection_data():
            data = self._engine.current_detection
            data["stats"] = self._stats.get_stats()
            return jsonify(data)

        @self._app.route("/reset_stats")
        def reset_stats():
            self._stats.reset()
            return jsonify({"status": "ok"})

    def _handle_signal(self, signum, frame):
        self._shutdown.set()

    def _check_parent(self):
        ppid = os.getppid()
        while not self._shutdown.is_set():
            if os.getppid() != ppid:
                self._shutdown.set()
                break
            time.sleep(1)

    def _free_port(self, port):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                s.bind(("0.0.0.0", port))
                return True
        except OSError:
            try:
                result = subprocess.run(
                    ["lsof", "-ti", f":{port}"],
                    capture_output=True, timeout=5,
                )
                if result.returncode == 0:
                    pid = result.stdout.strip()
                    if pid:
                        subprocess.run(["kill", "-9", pid], capture_output=True, timeout=5)
                        time.sleep(0.5)
                return True
            except Exception:
                return False

    def run(self):
        signal.signal(signal.SIGINT, self._handle_signal)
        signal.signal(signal.SIGTERM, self._handle_signal)
        signal.signal(signal.SIGHUP, self._handle_signal)
        self._free_port(self._port)

        self._camera.start()
        self._engine.start()
        engine_thread = threading.Thread(target=self._engine.run, daemon=True)
        engine_thread.start()

        parent_checker = threading.Thread(target=self._check_parent, daemon=True)
        parent_checker.start()

        logger.info("Stream server starting on port %d", self._port)
        try:
            self._app.run(host="0.0.0.0", port=self._port, threaded=True, debug=False)
        except (KeyboardInterrupt, SystemExit, OSError):
            self._shutdown.set()

        logger.info("Shutting down...")
        self._shutdown.set()
        self._engine.stop()
        self._camera.stop()
        self._detector.release()
        logger.info("Server stopped")
