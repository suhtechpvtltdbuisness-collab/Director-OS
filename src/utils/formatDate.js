const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-13" -> "13 Sep 2026". Falls back to an em dash for missing values. */
export function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Whole days from today until `iso`; negative once the date has passed. */
export function daysUntil(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return Math.ceil((d - new Date()) / 86400000);
}

/** Human deadline label, e.g. "in 6 days" or "8 days overdue". */
export function dueLabel(iso) {
  const n = daysUntil(iso);
  if (n === null) return "—";
  if (n === 0) return "Due today";
  if (n < 0) return `${Math.abs(n)} day${Math.abs(n) === 1 ? "" : "s"} overdue`;
  return `in ${n} day${n === 1 ? "" : "s"}`;
}
