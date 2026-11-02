import { useState, useEffect } from "react";
import useRealtimeGesture from "../hooks/useRealtimeGesture.js";
import CurrentGestureCard from "../components/Dashboard/CurrentGestureCard.jsx";
import FingerCountCard from "../components/Dashboard/FingerCountCard.jsx";
import SystemStatusCard from "../components/Dashboard/SystemStatusCard.jsx";
import CameraFeed from "../components/Dashboard/CameraFeed.jsx";
import GestureChart from "../components/Dashboard/GestureChart.jsx";

export default function DashboardPage() {
  const { current } = useRealtimeGesture();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5002/reset_stats").catch(() => {});
  }, []);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("http://localhost:5002/detection_data");
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        if (data.stats) setStats(data.stats);
      } catch {}
    };
    poll();
    const id = setInterval(poll, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="hand-text text-3xl text-[var(--color-ink)]">Dashboard</h1>
        <p className="text-sm text-[var(--color-ink-muted)] mt-0.5">
          Real-time hand gesture monitoring
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
        <CurrentGestureCard current={current} />
        <FingerCountCard current={current} />
        <SystemStatusCard current={current} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CameraFeed />
        <GestureChart stats={stats} />
      </div>
    </div>
  );
}
