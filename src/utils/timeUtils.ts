export function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString();
}

export function secondsToHMS(s: number): string {
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return `${hrs}h ${mins}m ${secs}s`;
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString();
}

export function formatTimeOnly(ts: number): string {
  return new Date(ts).toLocaleTimeString();
}
