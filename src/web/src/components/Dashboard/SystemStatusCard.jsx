import { isSystemOnline, formatTimestamp } from "../../utils/helpers.js";
import { HiOutlineWifi } from "react-icons/hi";

export default function SystemStatusCard({ current }) {
  const online = isSystemOnline(current?.timestamp);

  return (
    <div className="sketch-card p-5 animate-sketch-appear stagger-3 group highlight-yellow">
      <p className="ink-label mb-3">System Status</p>
      <div className="flex items-center gap-4">
        <div
          className={`sketch-icon w-14 h-14 rounded-xl border-2 border-dashed flex items-center justify-center shrink-0 ${
            online
              ? "border-[var(--color-accent-green)]/30 bg-[var(--color-accent-green)]/5"
              : "border-[var(--color-accent-coral)]/30 bg-[var(--color-accent-coral)]/5"
          }`}
        >
          <HiOutlineWifi
            className={`w-7 h-7 ${online ? "text-[var(--color-accent-green)]" : "text-[var(--color-accent-coral)]"}`}
          />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex w-3 h-3">
              <span
                className={`absolute inset-0 rounded-full ${
                  online
                    ? "animate-pulse-dot bg-[var(--color-accent-green)]"
                    : "bg-[var(--color-accent-coral)]"
                }`}
              />
              {online && (
                <span
                  className="absolute inset-0 rounded-full bg-[var(--color-accent-green)] animate-ping opacity-40"
                />
              )}
            </span>
            <p className="hand-text text-2xl text-[var(--color-ink)]">
              {online ? "Online" : "Offline"}
            </p>
          </div>
          {!online && (
            <p className="text-sm text-[var(--color-ink-muted)] mt-0.5">
              Last: {formatTimestamp(current?.timestamp)}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div
          className={`h-1.5 flex-1 rounded-sm transition-all duration-700 ${
            online ? "bg-[var(--color-accent-green)]/30" : "bg-[var(--color-accent-coral)]/20"
          }`}
        />
        <span className="text-[10px] text-[var(--color-ink-light)]">
          {online ? "Active" : "Idle"}
        </span>
      </div>
    </div>
  );
}
