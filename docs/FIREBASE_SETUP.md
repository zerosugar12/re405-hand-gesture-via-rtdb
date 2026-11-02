# Firebase Setup Guide

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Enter a project name (e.g. `hand-gesture-analytics`) — this will partially determine your database URL
4. You can disable **Google Analytics** (it's not needed for this project)
5. Click **Create project** and wait for the provisioning to finish

## 2. Enable Authentication (Email/Password)

The Python backend uses email/password auth to securely write to the Realtime Database.

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Find **Email/Password**, click to enable it, then click **Save**
3. Go to the **Users** tab, click **Add user**, and create a test account (any email + password)
4. Save these credentials — you'll need them when starting the Python server

## 3. Create a Realtime Database

1. In Firebase Console, go to **Realtime Database** → **Create Database**
2. Choose a region closest to your location
3. For **Security rules**, start with **test mode** (you can lock it down later):

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

This allows only authenticated users (anyone with a valid email/password account) to read/write.

4. Click **Enable**

> **Note:** Copy your **Database URL** (looks like `https://your-project-default-rtdb.firebaseio.com`). You'll need it in the next steps.

## 4. Generate Admin SDK Credentials (Python)

The Python server uses a Firebase service account to authenticate and write data.

1. Go to **Project Settings** (gear icon) → **Service accounts**
2. Click **Generate new private key**
3. A JSON file will be downloaded — **keep this file secure** (it grants full access)
4. Save it as `src/python/firebase-credentials.json` in the project directory

## 5. Create a Web App & Get Config (React)

The React dashboard needs Firebase config to authenticate users on the frontend.

1. Go to **Project Settings** → **General**
2. Under **Your apps**, click **Add app** → **Web** (the `</>` icon)
3. Register the app with a nickname (e.g. `web-dashboard`)
4. Copy the `firebaseConfig` object that appears — it contains values like `apiKey`, `authDomain`, `databaseURL`, etc.

## 6. Configure Environment Variables

### React (`src/web/.env`)

Create `src/web/.env` (copy from `src/web/.env.example`) and fill in the values from step 5:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_API_BASE_URL=http://localhost:5002
```

### Python

You have two options:

**Option A** — Place the credentials file at `src/python/firebase-credentials.json` (the Python server looks here by default).

**Option B** — Use environment variables (useful for production/deployment):

```bash
export FIREBASE_CREDENTIALS=/path/to/firebase-credentials.json
export FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
```

## 7. Run the Project

### Python Server

```bash
cd src/python
pip install -r requirements.txt
python main.py
```

On first run, you'll be prompted for the email/password of the test account you created in step 2. The server uses these to authenticate with Firebase.

### React Dashboard

```bash
cd src/web
npm install
npm run dev
```

Open `http://localhost:3000` in your browser. You'll need to sign in with the same test account credentials.

## Database Structure (auto-created)

Once the Python server runs and detects gestures, Firebase will automatically populate this structure:

```
hand_gesture/
├── current/
│   ├── fingers: 2
│   ├── gesture: "Peace"
│   └── timestamp: 1749450000
├── stats/
│   ├── totalDetection: 152
│   ├── fistCount: 20
│   ├── pointCount: 15
│   ├── peaceCount: 70
│   ├── threeCount: 10
│   ├── fourCount: 12
│   └── openHandCount: 25
└── history/
    └── {timestamp}/
        ├── fingers: 2
        ├── gesture: "Peace"
        └── timestamp: 1749450000123
```

- `current/` — latest detected gesture
- `stats/` — aggregated counts per gesture type
- `history/` — time-stamped log of every detection
