const pad = (n) => String(n).padStart(2, '0');

// Today's date in the user's own time zone, as YYYY-MM-DD
export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// "2026-10-08" -> "08/10/2026" (no time-zone maths, so it never shifts a day)
export const formatDate = (s) => {
  const [y, m, d] = String(s).slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
};

// "2026-10-08" -> "2026-10"
export const monthKey = (s) => String(s).slice(0, 7);
