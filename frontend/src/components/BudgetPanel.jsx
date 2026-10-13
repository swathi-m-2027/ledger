import { useMemo, useState } from 'react';
import { spentByCategory } from '../budgetUtils';

const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(v));
const input = 'border border-ledger rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent';

export default function BudgetPanel({ budgets, transactions, onSave, onRemove }) {
  const spent = useMemo(() => spentByCategory(transactions), [transactions]);
  const [categoryId, setCategoryId] = useState('');
  const [limit, setLimit] = useState('');

  const active = budgets.filter((b) => b.monthly_limit);
  const overCount = active.filter((b) => (spent[b.category] || 0) > b.monthly_limit).length;
  const monthName = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  const submit = (e) => {
    e.preventDefault();
    if (!categoryId || !limit) return;
    onSave(Number(categoryId), parseFloat(limit));
    setCategoryId('');
    setLimit('');
  };

  return (
    <div className="bg-white border border-ledger rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-ink">Monthly Budgets</h3>
          <p className="text-xs text-slate-400">{monthName}</p>
        </div>
        {overCount > 0 && (
          <span className="text-xs font-medium bg-red-50 text-loss border border-loss/30 rounded-full px-3 py-1">
            {overCount} over budget
          </span>
        )}
      </div>

      {active.length === 0 && <p className="text-sm text-slate-400 mb-4">No budgets yet. Set a limit below to start tracking.</p>}

      <div className="flex flex-col gap-4 mb-5">
        {active.map((b) => {
          const s = spent[b.category] || 0;
          const pct = (s / b.monthly_limit) * 100;
          const bar = pct > 100 ? 'bg-loss' : pct >= 80 ? 'bg-amber-500' : 'bg-gain';
          const left = b.monthly_limit - s;
          return (
            <div key={b.category_id}>
              <div className="flex items-baseline justify-between text-sm mb-1.5">
                <span className="text-ink font-medium">{b.category}</span>
                <span className="font-mono tabular-nums text-slate-500 text-xs">
                  {fmt(s)} / {fmt(b.monthly_limit)}
                </span>
              </div>
              <div className="h-2.5 bg-ledger rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${bar}`} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
              <div className="flex items-center justify-between mt-1.5 text-xs">
                <span className={pct > 100 ? 'text-loss font-medium' : pct >= 80 ? 'text-amber-600 font-medium' : 'text-slate-400'}>
                  {pct > 100 ? `${fmt(-left)} over budget` : `${fmt(left)} left · ${Math.round(pct)}% used`}
                </span>
                <span className="flex gap-3">
                  <button onClick={() => { setCategoryId(String(b.category_id)); setLimit(String(b.monthly_limit)); }} className="text-slate-400 hover:text-accent transition-colors">Edit</button>
                  <button onClick={() => onRemove(b.category_id)} className="text-slate-400 hover:text-loss transition-colors">Remove</button>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-ledger">
        <select className={`${input} sm:flex-1`} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="">Choose category…</option>
          {budgets.map((b) => <option key={b.category_id} value={b.category_id}>{b.category}</option>)}
        </select>
        <input className={`${input} font-mono sm:w-40`} type="number" min="1" step="1" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="Monthly limit ₹" required />
        <button type="submit" className="bg-ink text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-slate-800 transition-colors">Set budget</button>
      </form>
    </div>
  );
}
