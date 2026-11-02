import { GESTURE_ICONS, GESTURE_COLORS } from "../../utils/constants.js";

export default function CurrentGestureCard({ current }) {
  const gesture = current?.gesture || "Waiting...";
  const fingers = current?.fingers ?? "-";
  const icon = GESTURE_ICONS[gesture] || "🔄";
  const color = GESTURE_COLORS[gesture] || "#5b8def";

  return (
    <div className="sketch-card p-5 animate-sketch-appear stagger-1 group highlight-blue">
      <p className="ink-label mb-3">Current Gesture</p>
      <div className="flex items-center gap-4">
        <div
          className="sketch-icon w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 border-2 border-dashed"
          style={{ borderColor: `${color}40`, backgroundColor: `${color}08` }}
        >
          <span className="animate-wobble" style={{ display: "inline-block" }}>
            {icon}
          </span>
        </div>
        <div className="min-w-0">
          <p className="hand-text text-2xl text-[var(--color-ink)] truncate">{gesture}</p>
          <p className="text-sm text-[var(--color-ink-muted)]">
            {fingers} finger{fingers !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div className="mt-4 sketch-stats-grid">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="stat-bar">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((i < (current?.fingers || 0)) ? 100 : 0)}%`,
                backgroundColor: color,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
