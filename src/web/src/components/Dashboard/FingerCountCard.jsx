import { HiOutlineHand } from "react-icons/hi";

export default function FingerCountCard({ current }) {
  const count = current?.fingers ?? 0;

  return (
    <div className="sketch-card p-5 animate-sketch-appear stagger-2 group highlight-blue">
      <p className="ink-label mb-3">Finger Count</p>
      <div className="flex items-center gap-4">
        <div className="sketch-icon w-14 h-14 rounded-xl border-2 border-dashed border-[var(--color-accent-teal)]/30 bg-[var(--color-accent-teal)]/5 flex items-center justify-center shrink-0">
          <HiOutlineHand className="w-7 h-7 text-[var(--color-accent-teal)]" />
        </div>
        <div>
          <p className="hand-number text-3xl text-[var(--color-ink)]">{count}</p>
          <p className="text-sm text-[var(--color-ink-muted)]">open fingers</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-sm transition-all duration-700"
              style={{
                height: `${8 + (i + 1) * 5}px`,
                backgroundColor: i < count ? "var(--color-accent-teal)" : "var(--color-border-sketch)",
                opacity: i < count ? 0.7 : 0.4,
              }}
            />
            <span className="text-[10px] text-[var(--color-ink-light)]">{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
