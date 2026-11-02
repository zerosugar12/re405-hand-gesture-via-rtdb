import os
from pathlib import Path

FIREBASE_CREDENTIALS_PATH = os.getenv(
    "FIREBASE_CREDENTIALS",
    str(Path(__file__).parent / "firebase-credentials.json")
)

FIREBASE_DATABASE_URL = os.getenv(
    "FIREBASE_DATABASE_URL",
    "https://xx-project-default-rtdb.firebasedatabase.app/"
)

CAMERA_INDEX = 0
FRAME_WIDTH = 640
FRAME_HEIGHT = 480

GESTURE_MAP = {
    0: "Fist",
    1: "Point",
    2: "Peace",
    3: "Three",
    4: "Four",
    5: "Open Hand",
}

FINGER_TIPS = [4, 8, 12, 16, 20]
FINGER_PIPS = [3, 6, 10, 14, 18]
THUMB_IP = 3
INDEX_BASE = 5
WRIST = 0

DETECTION_CONFIDENCE = 0.7
TRACKING_CONFIDENCE = 0.5
