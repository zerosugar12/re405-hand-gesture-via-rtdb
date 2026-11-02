#!/bin/bash

# Resolve the project root (one directory up from scripts/)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Override with: PYTHON_BIN=/path/to/python ./scripts/start.sh
PYTHON_BIN="${PYTHON_BIN:-python}"

echo "================================="
echo " Hand Gesture Analytics Dashboard"
echo "================================="
echo ""

cleanup() {
    echo ""
    echo "Shutting down..."
    kill $PYTHON_PID 2>/dev/null
    kill $REACT_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

echo "[1/2] Starting Python backend..."
cd "$ROOT_DIR/src/python" && "$PYTHON_BIN" main.py &
PYTHON_PID=$!

echo "[2/2] Starting React frontend..."
cd "$ROOT_DIR/src/web" && npm run dev &
REACT_PID=$!

echo ""
echo "Python PID: $PYTHON_PID"
echo "React PID:  $REACT_PID"
echo ""
echo "Press Ctrl+C to stop both services."
echo ""

wait
