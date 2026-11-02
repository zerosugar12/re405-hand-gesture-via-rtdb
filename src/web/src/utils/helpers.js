export function formatTimestamp(ts) {
  if (!ts) return "N/A";
  const date = new Date(ts);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function formatFullDate(ts) {
  if (!ts) return "N/A";
  const date = new Date(ts);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function isSystemOnline(timestamp) {
  if (!timestamp) return false;
  const now = Date.now();
  const ts = timestamp.toString().length > 10
    ? timestamp
    : timestamp * 1000;
  return now - ts < 10000;
}

export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
