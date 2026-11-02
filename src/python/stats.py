import threading


class StatsTracker:
    def __init__(self):
        self._stats = {
            "totalDetection": 0,
            "fistCount": 0,
            "pointCount": 0,
            "peaceCount": 0,
            "threeCount": 0,
            "fourCount": 0,
            "openHandCount": 0,
        }
        self._lock = threading.Lock()
        self._stat_key_map = {
            "Fist": "fistCount",
            "Point": "pointCount",
            "Peace": "peaceCount",
            "Three": "threeCount",
            "Four": "fourCount",
            "Open Hand": "openHandCount",
        }

    def record_gesture(self, gesture):
        with self._lock:
            self._stats["totalDetection"] += 1
            key = self._stat_key_map.get(gesture)
            if key:
                self._stats[key] += 1

    def get_stats(self):
        with self._lock:
            return dict(self._stats)

    def reset(self):
        with self._lock:
            for k in self._stats:
                self._stats[k] = 0
