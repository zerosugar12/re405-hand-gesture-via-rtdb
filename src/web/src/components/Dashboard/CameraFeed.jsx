import { useState, useEffect, useRef } from "react";
import { HiOutlineVideoCamera, HiOutlineStop } from "react-icons/hi";
import { GESTURE_ICONS, GESTURE_COLORS } from "../../utils/constants.js";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5002";
const FRAME_INTERVAL = 250;
const DETECTION_INTERVAL = 500;

export default function CameraFeed() {
  const [active, setActive] = useState(true);
  const [gesture, setGesture] = useState("No Hand");
  const [fingers, setFingers] = useState(0);
  const [connected, setConnected] = useState(false);
  const imgRef = useRef(null);
  const frameSeqRef = useRef(0);
  const lastUrlRef = useRef("");

  useEffect(() => {
    if (!active) return;

    const frameId = setInterval(() => {
      if (!imgRef.current) return;
      frameSeqRef.current += 1;
      const url = `${BASE}/frame.jpg?s=${frameSeqRef.current}`;
      if (url !== lastUrlRef.current) {
        lastUrlRef.current = url;
        imgRef.current.src = url;
      }
    }, FRAME_INTERVAL);

    const detectId = setInterval(async () => {
      try {
        const res = await fetch(`${BASE}/detection_data`);
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setGesture(data.gesture || "No Hand");
        setFingers(data.fingers ?? 0);
        setConnected(true);
      } catch {
        setConnected(false);
      }
    }, DETECTION_INTERVAL);

    return () => {
      clearInterval(frameId);
      clearInterval(detectId);
    };
  }, [active]);

  const icon = GESTURE_ICONS[gesture] || "🔄";
  const color = GESTURE_COLORS[gesture] || "#5b8def";

  return (
    <div className="sketch-card overflow-hidden animate-sketch-appear group highlight-blue">
      <div className="p-4 pb-2 flex items-center justify-between">
        <h3 className="ink-label">Camera Feed</h3>
        <div className="flex items-center gap-2.5">
          <span
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border-2 transition-all ${
              connected
                ? "border-[var(--color-accent-green)]/30 text-[var(--color-accent-green)]"
                : "border-[var(--color-accent-coral)]/30 text-[var(--color-accent-coral)]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                connected ? "bg-[var(--color-accent-green)]" : "bg-[var(--color-accent-coral)]"
              }`}
            />
            {connected ? "Live" : "Off"}
          </span>
          <button
            onClick={() => setActive(!active)}
            className={`p-1.5 rounded-xl border-2 transition-all duration-300 ${
              active
                ? "border-[var(--color-accent-coral)]/20 text-[var(--color-accent-coral)] hover:bg-[var(--color-accent-coral)]/5"
                : "border-[var(--color-accent-blue)]/20 text-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue)]/5"
            }`}
          >
            {active ? <HiOutlineStop className="w-4 h-4" /> : <HiOutlineVideoCamera className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="relative mx-4 mb-4 rounded-xl overflow-hidden bg-[var(--color-paper-dark)] aspect-[4/3] border-2 border-dashed border-[var(--color-border-sketch)]">
        {active ? (
          <>
            <img
              ref={imgRef}
              src={`${BASE}/frame.jpg?s=0`}
              alt="Camera Feed"
              className="w-full h-full object-cover"
              onError={() => setConnected(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2">
                <span className="text-xl drop-shadow">{icon}</span>
                <span className="font-semibold text-[var(--color-ink)] drop-shadow">
                  {gesture}
                </span>
                <span className="text-[var(--color-ink-muted)] text-sm ml-auto">
                  {fingers} {fingers !== 1 ? "fingers" : "finger"}
                </span>
              </div>
            </div>
            {connected && (
              <>
                <div
                  className="absolute top-3 left-3 px-3 py-1 rounded-xl text-xs font-semibold shadow-sm"
                  style={{
                    backgroundColor: `${color}15`,
                    color: color,
                    border: `2px solid ${color}30`,
                  }}
                >
                  {gesture}
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--color-card-bg)]/80 border border-[var(--color-accent-green)]/20 text-xs text-[var(--color-accent-green)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-green)]" />
                  REC
                </div>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-ink-light)] bg-[var(--color-paper-dark)]/50">
            <HiOutlineVideoCamera className="w-12 h-12 mb-2 opacity-30" />
            <p className="text-sm font-medium">Camera paused</p>
          </div>
        )}
      </div>
    </div>
  );
}
