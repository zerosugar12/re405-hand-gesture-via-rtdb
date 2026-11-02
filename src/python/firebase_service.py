import time
import firebase_admin
from firebase_admin import credentials, db
from config import FIREBASE_CREDENTIALS_PATH, FIREBASE_DATABASE_URL


class FirebaseService:
    def __init__(self):
        self.app = None
        self.connected = False
        self._init_firebase()

    def _init_firebase(self):
        try:
            cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
            self.app = firebase_admin.initialize_app(cred, {
                "databaseURL": FIREBASE_DATABASE_URL
            })
            self.connected = True
        except Exception:
            self.connected = False

    def update_current(self, fingers, gesture):
        if not self.connected:
            return False
        try:
            ref = db.reference("hand_gesture/current")
            ref.set({
                "fingers": fingers,
                "gesture": gesture,
                "timestamp": int(time.time()),
            })
            return True
        except Exception:
            return False
