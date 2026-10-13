import { monthKey, todayStr } from './dateUtils';

// Total expense per category for the CURRENT month, calculated from local data (so it is instant)
export function spentByCategory(transactions) {
  const thisMonth = monthKey(todayStr());
  const map = {};
  transactions.forEach((t) => {
    if (t.type !== 'expense' || !t.category) return;
    if (monthKey(t.txn_date) !== thisMonth) return;
    map[t.category] = (map[t.category] || 0) + Number(t.amount);
  });
  return map;
}
