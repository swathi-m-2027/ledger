import { useState } from 'react';
const input = 'border border-ledger rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent';
export default function TransactionForm({ categories, onSubmit }) {
  const [form, setForm] = useState({ description: '', amount: '', type: 'expense', category_id: '' });
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, amount: parseFloat(form.amount), category_id: form.category_id || null });
    setForm({ description: '', amount: '', type: form.type, category_id: '' }); // instant reset, ready for the next entry
  };
  return (
    <form onSubmit={submit} className="bg-white border border-ledger rounded-xl p-6">
      <h3 className="font-display font-semibold text-ink mb-4">Add Transaction</h3>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
        <div className="sm:col-span-2 flex flex-col gap-1">
          <label className="text-xs text-slate-400">Description</label>
          <input className={input} value={form.description} onChange={set('description')} placeholder="e.g. Grocery shopping" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Amount (₹)</label>
          <input className={`${input} font-mono`} type="number" step="0.01" min="0" value={form.amount} onChange={set('amount')} placeholder="0.00" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Type</label>
          <select className={input} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, category_id: '' })}>
            <option value="expense">Expense</option><option value="income">Income</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Category</label>
          <select className={input} value={form.category_id} onChange={set('category_id')}>
            <option value="">None</option>
            {categories.filter((c) => c.type === form.type).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <button type="submit" className="mt-4 bg-ink text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors">Add Transaction</button>
    </form>
  );
}
