## Architecture & Workflow
```text
                   +----------------------+
                   |    Webcam (Camera)   |
                   +----------+-----------+
                              |
                              | frames
                              v
        +-------------------------------------------------+
        |           Backend   (Flask :5002)              |
        |-------------------------------------------------|
        | camera.py ─► hand_detector.py (MediaPipe)      |
        |                └► detection_engine.py          |
        |                     ├► firebase_service.py     |
        |                     └► server.py               |
        |                          ├─ /frame.jpg          |
        |                          └─ /detection_data     |
        +----------+-----------------------------+-------+
                   |                             |
            RTDB write                        JSON/JPEG
                   v                             |
        +----------------------+                 |
        |  Firebase RTDB       |                 |
        |----------------------|                 |
        | hand_gesture/current |                 |
        | hand_gesture/stats   |                 v
        | hand_gesture/history |         +----------------------+
        +----------+-----------+         |  video stream        |
                   |                     |  (image/jpeg)        |
                   | realtime listener    +----------+-----------+
                   v                                |
        +----------------------+                    |
        |  Frontend Vite :3000 |                    |
        |----------------------|                    |
        | useRealtimeGesture   |◄───────────────────┘
        | CameraFeed           |
        | DashboardPage        |
        +----------------------+
```

1. **Capture** — backend (`camera.py`) opens the camera and reads continuous frames.
2. **Detect** — `hand_detector.py` runs the MediaPipe HandLandmarker; `detection_engine.py` counts fingers to map a gesture (Fist, Point, Peace, Three, Four, Open Hand).
3. **Sync** — `firebase_service.py` writes results (`current`, `stats`, `history`) to Firebase Realtime Database.
4. **Serve** — `server.py` exposes the annotated frame (`/frame.jpg`) and live data (`/detection_data`).
5. **Display** — the frontend (`useRealtimeGesture` + `services/firebase.js`) listens to Firebase realtime data for stats/charts and shows the camera feed from the backend.

## Quick Start

**1. Setup**
```bash
cd src/python && pip install -r requirements.txt
cd ../../src/web && cp .env.example .env && npm install
```

Download [`hand_landmarker.task`](https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task) to `src/python/`.

See `docs/FIREBASE_SETUP.md` for Firebase credentials and env configuration.

**2. Run**
```bash
# Terminal 1 — Python backend server (port 5002)
cd src/python && python main.py

# Terminal 2 — React frontend dashboard (port 3000)
cd src/web && npm run dev
```

**3. One command (optional)**
```bash
./scripts/start.sh
```

Set the backend URL via `src/web/.env` -> `VITE_API_BASE_URL=http://localhost:5002` (default).

Open `http://localhost:3000`.

## Demo

[![Demo](https://img.youtube.com/vi/e9tR2gSWEm4/0.jpg)](https://youtu.be/e9tR2gSWEm4)
