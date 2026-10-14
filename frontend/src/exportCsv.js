import { formatDate } from './dateUtils';

// Wrap a value for CSV. Also stops spreadsheet "formula" tricks: text starting with = + - @ is prefixed with '
const cell = (value) => {
  let s = String(value ?? '');
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export function exportCsv(transactions, label) {
  const header = ['Date', 'Description', 'Type', 'Category', 'Amount'];
  const rows = transactions.map((t) => [
    formatDate(t.txn_date), t.description, t.type, t.category || '', Number(t.amount).toFixed(2),
  ]);
  const csv = [header, ...rows]
    .map((r) => r.map((c, i) => (i === 4 && r !== header ? c.replace(/^'/, '') : cell(c))).join(','))
    .join('\r\n');

  // The leading BOM makes Excel read ₹ and other characters correctly
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ledger-${label}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
