export default function Spinner({ size = "md" }) {
  const sizeMap = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };
  const s = sizeMap[size] || sizeMap.md;
  return (
    <div
      className={`${s} border-2 border-dashed border-[var(--color-accent-blue)]/30 border-t-[var(--color-accent-blue)] rounded-full animate-spin`}
    />
  );
}
