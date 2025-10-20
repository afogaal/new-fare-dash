import { ShiftHistory } from "@/types/tracker";

export function downloadBlob(
  filename: string,
  content: string,
  mime = "text/csv"
) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportToCSV(history: ShiftHistory[]) {
  const rows = [["start", "end", "seconds", "hours", "earnings", "trips"]];

  history.forEach((sh) => {
    const hours = (sh.seconds / 3600).toFixed(2);
    rows.push([
      new Date(sh.startTs).toISOString(),
      new Date(sh.endTs).toISOString(),
      String(sh.seconds),
      hours,
      String(sh.earnings),
      String(sh.trips),
    ]);
  });

  const csv = rows
    .map((r) =>
      r.map((cell) => '"' + String(cell).replace(/"/g, '""') + '"').join(",")
    )
    .join("\n");

  downloadBlob(
    `taxi-shifts-${new Date().toISOString().slice(0, 10)}.csv`,
    csv,
    "text/csv"
  );
}
