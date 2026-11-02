import cv2
import time
import threading
from config import CAMERA_INDEX, FRAME_WIDTH, FRAME_HEIGHT


class Camera:
    def __init__(self):
        self._cap = cv2.VideoCapture(CAMERA_INDEX)
        if not self._cap.isOpened():
            raise RuntimeError("Cannot access webcam")
        self._cap.set(cv2.CAP_PROP_FRAME_WIDTH, FRAME_WIDTH)
        self._cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_HEIGHT)
        self._frame = None
        self._lock = threading.Lock()
        self._running = False
        self._thread = None

    def start(self):
        self._running = True
        self._thread = threading.Thread(target=self._grab_loop, daemon=True)
        self._thread.start()

    def stop(self):
        self._running = False
        if self._thread:
            self._thread.join(timeout=2)
        self._cap.release()

    def _grab_loop(self):
        while self._running:
            try:
                ret, frame = self._cap.read()
                if ret:
                    frame = cv2.flip(frame, 1)
                    with self._lock:
                        self._frame = frame
                else:
                    time.sleep(0.1)
            except Exception:
                time.sleep(0.1)

    def read(self):
        with self._lock:
            if self._frame is None:
                return None
            return self._frame.copy()

    @property
    def is_active(self):
        return self._running
