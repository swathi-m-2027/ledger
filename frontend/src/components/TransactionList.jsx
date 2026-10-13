import { useMemo, useState } from 'react';
import { formatDate } from '../dateUtils';

const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

export default function TransactionList({ transactions, onDelete, onEdit }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const visible = useMemo(() => transactions.filter((t) => {
    const q = query.toLowerCase();
    return (t.description.toLowerCase().includes(q) || (t.category || '').toLowerCase().includes(q)) && (type === 'all' || t.type === type);
  }), [transactions, query, type]);

  return (
    <div className="bg-white border border-ledger rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-ledger flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="font-display font-semibold text-ink">Transactions</h3>
        <div className="flex gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="border border-ledger rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-accent" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="border border-ledger rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
            <option value="all">All</option><option value="income">Income</option><option value="expense">Expense</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-6 py-3 font-medium">Description</th><th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Date</th><th className="px-6 py-3 font-medium text-right">Amount</th><th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">{transactions.length ? 'No matches.' : 'No transactions yet. Add your first one above.'}</td></tr>}
            {visible.map((t) => {
              const saving = String(t.id).startsWith('temp-');
              return (
                <tr key={t.id} className={`border-t border-ledger hover:bg-paper/60 animate-row-in ${saving ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-3 text-ink">{t.description}</td>
                  <td className="px-6 py-3 text-slate-500">{t.category || '—'}</td>
                  <td className="px-6 py-3 text-slate-500">{formatDate(t.txn_date)}</td>
                  <td className={`px-6 py-3 text-right font-mono tabular-nums ${t.type === 'income' ? 'text-gain' : 'text-loss'}`}>{t.type === 'income' ? '+' : '−'} {fmt(Math.abs(t.amount))}</td>
                  <td className="px-6 py-3 text-right whitespace-nowrap">
                    {saving ? <span className="text-xs text-slate-400">Saving…</span> : (
                      <>
                        <button onClick={() => onEdit(t)} className="text-xs text-slate-400 hover:text-accent transition-colors mr-3">Edit</button>
                        <button onClick={() => onDelete(t.id)} className="text-xs text-slate-400 hover:text-loss transition-colors">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
