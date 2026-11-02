import { useMemo } from "react";
import { GESTURE_MAP, GESTURE_COLORS } from "../../utils/constants.js";

const STAT_KEY_MAP = {
  Fist: "fistCount", Point: "pointCount", Peace: "peaceCount",
  Three: "threeCount", Four: "fourCount", "Open Hand": "openHandCount",
};

export default function GestureChart({ stats }) {
  const hasData = stats && stats.totalDetection > 0;

  const labels = Object.values(GESTURE_MAP);
  const colors = labels.map((g) => GESTURE_COLORS[g] || "#5b8def");
  const counts = useMemo(() =>
    labels.map((g) => stats?.[STAT_KEY_MAP[g]] || 0),
    [stats]
  );
  const maxVal = Math.max(...counts, 1);

  return (
    <div className="sketch-card p-5 animate-sketch-appear group highlight-blue">
      <p className="ink-label mb-5">Gesture Distribution</p>

      {hasData ? (
        <div className="space-y-6">
          <div className="space-y-4">
            {labels.map((g, i) => {
              const pct = (counts[i] / maxVal) * 100;
              return (
                <div key={g} className="flex items-center gap-2 group/bar">
                  <span className="text-xs w-[4.5rem] text-right text-[var(--color-ink-muted)] font-medium truncate shrink-0">
                    {g}
                  </span>
                  <div className="flex-1 relative">
                    <div className="w-full h-6 bg-[var(--color-border-sketch)]/40 rounded-sm overflow-hidden">
                      <div
                        className="h-full rounded-sm transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.max(pct, 3)}%`,
                          backgroundColor: `${colors[i]}20`,
                          borderRight: `2.5px solid ${colors[i]}`,
                        }}
                      />
                    </div>
                  </div>
                  <span
                    className="text-xs font-bold w-6 text-right shrink-0"
                    style={{ color: colors[i] }}
                  >
                    {counts[i]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="sketch-stats-grid !grid-cols-6 gap-2">
            {labels.map((g, i) => (
              <div key={g} className="flex flex-col items-center gap-1.5">
                <div className="w-full rounded-sm bg-[var(--color-border-sketch)]/30 overflow-hidden h-1.5">
                  <div
                    className="h-full rounded-sm"
                    style={{
                      width: `${(counts[i] / maxVal) * 100}%`,
                      backgroundColor: colors[i],
                    }}
                  />
                </div>
                <span className="text-[9px] text-[var(--color-ink-light)] truncate w-full text-center leading-tight">
                  {g}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full bg-[var(--color-paper-dark)]/50 rounded-xl p-4 border border-dashed border-[var(--color-border-sketch)] flex items-center justify-between">
            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[var(--color-ink-light)]">
              Total Detections
            </p>
            <p className="hand-number text-xl text-[var(--color-ink)]">
              {stats.totalDetection.toLocaleString()}
              <span className="text-sm text-[var(--color-ink-muted)] font-sans font-normal ml-1">
                detections
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-[var(--color-ink-muted)]">
          <svg className="w-12 h-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm font-medium">No data yet</p>
          <p className="text-xs text-[var(--color-ink-light)] mt-1">
            Start the Python server to collect gestures
          </p>
        </div>
      )}
    </div>
  );
}
