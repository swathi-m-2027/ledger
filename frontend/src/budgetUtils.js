// Total expense per category for the CURRENT month, calculated from local data (so it is instant)
export function spentByCategory(transactions) {
  const now = new Date();
  const map = {};
  transactions.forEach((t) => {
    if (t.type !== 'expense' || !t.category) return;
    const d = new Date(t.txn_date);
    if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) return;
    map[t.category] = (map[t.category] || 0) + Number(t.amount);
  });
  return map;
}
