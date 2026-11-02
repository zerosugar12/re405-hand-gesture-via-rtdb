import time
import logging

logger = logging.getLogger("DetectionEngine")


class DetectionEngine:
    def __init__(self, camera, detector, firebase, stats):
        self._camera = camera
        self._detector = detector
        self._firebase = firebase
        self._stats = stats
        self._running = False
        self._display_frame = None
        self._current_detection = {
            "gesture": "No Hand",
            "fingers": 0,
            "timestamp": 0,
        }

    def start(self):
        self._running = True

    def stop(self):
        self._running = False

    @property
    def display_frame(self):
        return self._display_frame

    @property
    def current_detection(self):
        return dict(self._current_detection)

    def run(self):
        last_gesture = None
        last_send_time = 0
        cooldown = 0.5
        error_count = 0

        while self._running:
            try:
                frame = self._camera.read()
                if frame is None:
                    time.sleep(0.01)
                    continue

                frame = self._detector.find_hands(frame, draw=True)
                finger_count = self._detector.count_fingers()
                self._display_frame = frame

                now = time.time()
                error_count = 0

                if finger_count is not None:
                    gesture = self._detector.get_gesture_name(finger_count)
                    self._current_detection = {
                        "gesture": gesture,
                        "fingers": finger_count,
                        "timestamp": int(now),
                    }
                    if (now - last_send_time) >= cooldown:
                        self._firebase.update_current(finger_count, gesture)
                        if gesture != last_gesture:
                            logger.info("Gesture: %s (%d fingers)", gesture, finger_count)
                            self._stats.record_gesture(gesture)
                            last_gesture = gesture
                        last_send_time = now
                else:
                    now_ms = int(now * 1000)
                    self._current_detection = {
                        "gesture": "No Hand",
                        "fingers": 0,
                        "timestamp": now_ms,
                    }
                    if last_gesture is not None and (now - last_send_time) >= 2.0:
                        self._firebase.update_current(0, "No Hand")
                        last_gesture = None
                        last_send_time = now
            except Exception as e:
                error_count += 1
                if error_count > 10:
                    logger.error("Too many detect errors, stopping loop")
                    break
                logger.error("Detect loop error: %s", e)
            time.sleep(0.01)
