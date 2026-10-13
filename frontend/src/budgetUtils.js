import { monthKey, todayStr } from './dateUtils';

// Total expense per category for one month (default: the current month), from local data so it is instant
export function spentByCategory(transactions, month = monthKey(todayStr())) {
  const map = {};
  transactions.forEach((t) => {
    if (t.type !== 'expense' || !t.category) return;
    if (monthKey(t.txn_date) !== month) return;
    map[t.category] = (map[t.category] || 0) + Number(t.amount);
  });
  return map;
}
