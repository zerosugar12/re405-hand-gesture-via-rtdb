import cv2
import mediapipe as mp
from mediapipe.tasks.python.vision import (
    HandLandmarker, HandLandmarkerOptions,
    HandLandmarksConnections, RunningMode,
)
from mediapipe import Image as MpImage
from mediapipe import ImageFormat
from config import FINGER_TIPS, FINGER_PIPS, GESTURE_MAP, DETECTION_CONFIDENCE, TRACKING_CONFIDENCE
from pathlib import Path

MODEL_PATH = str(Path(__file__).parent / "hand_landmarker.task")


class HandDetector:
    def __init__(self):
        options = HandLandmarkerOptions(
            base_options=mp.tasks.BaseOptions(model_asset_path=MODEL_PATH),
            running_mode=RunningMode.IMAGE,
            num_hands=1,
            min_hand_detection_confidence=DETECTION_CONFIDENCE,
            min_hand_presence_confidence=DETECTION_CONFIDENCE,
            min_tracking_confidence=TRACKING_CONFIDENCE,
        )
        self.landmarker = HandLandmarker.create_from_options(options)

    def find_hands(self, frame, draw=True):
        h, w = frame.shape[:2]
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = MpImage(image_format=ImageFormat.SRGB, data=rgb)
        result = self.landmarker.detect(mp_image)
        if result.hand_landmarks:
            self.current_landmarks = result.hand_landmarks[0]
            if draw:
                self._draw_landmarks(frame, w, h)
        else:
            self.current_landmarks = None
        return frame

    def _draw_landmarks(self, frame, w, h):
        for conn in HandLandmarksConnections.HAND_CONNECTIONS:
            start = self.current_landmarks[conn.start]
            end = self.current_landmarks[conn.end]
            x1, y1 = int(start.x * w), int(start.y * h)
            x2, y2 = int(end.x * w), int(end.y * h)
            cv2.line(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        for landmark in self.current_landmarks:
            x = int(landmark.x * w)
            y = int(landmark.y * h)
            cv2.circle(frame, (x, y), 5, (0, 255, 0), -1)

    def count_fingers(self):
        lm = self.current_landmarks
        if not lm:
            return None
        fingers = []
        if lm[FINGER_TIPS[0]].x > lm[FINGER_TIPS[0] - 1].x:
            fingers.append(1)
        else:
            fingers.append(0)
        for i in range(1, 5):
            if lm[FINGER_TIPS[i]].y < lm[FINGER_PIPS[i]].y:
                fingers.append(1)
            else:
                fingers.append(0)
        return sum(fingers)

    def get_gesture_name(self, finger_count):
        return GESTURE_MAP.get(finger_count, "Unknown")

    def release(self):
        self.landmarker.close()
