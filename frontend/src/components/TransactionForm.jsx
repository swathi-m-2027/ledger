import { useEffect, useState } from 'react';
import { todayStr } from '../dateUtils';

const input = 'border border-ledger rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent';
const empty = () => ({ description: '', amount: '', type: 'expense', category_id: '', txn_date: todayStr() });

export default function TransactionForm({ categories, onSubmit, editing, onCancel }) {
  const [form, setForm] = useState(empty());

  // When "Edit" is clicked on a row, fill the form with that transaction
  useEffect(() => {
    if (editing) {
      setForm({
        description: editing.description,
        amount: String(editing.amount),
        type: editing.type,
        category_id: editing.category_id ? String(editing.category_id) : '',
        txn_date: String(editing.txn_date).slice(0, 10),
      });
    } else {
      setForm(empty());
    }
  }, [editing]);

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, amount: parseFloat(form.amount), category_id: form.category_id || null });
    if (!editing) setForm({ ...empty(), type: form.type });
  };

  return (
    <form id="txn-form" onSubmit={submit} className={`bg-white border rounded-xl p-6 transition-colors ${editing ? 'border-accent ring-2 ring-accent/20' : 'border-ledger'}`}>
      <h3 className="font-display font-semibold text-ink mb-4">{editing ? 'Edit Transaction' : 'Add Transaction'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
        <div className="sm:col-span-2 flex flex-col gap-1">
          <label className="text-xs text-slate-400">Description</label>
          <input className={input} value={form.description} onChange={set('description')} placeholder="e.g. October salary" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Amount (₹)</label>
          <input className={`${input} font-mono`} type="number" step="0.01" min="0.01" value={form.amount} onChange={set('amount')} placeholder="0.00" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Date</label>
          <input className={input} type="date" value={form.txn_date} onChange={set('txn_date')} required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Type</label>
          <select className={input} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, category_id: '' })}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
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
      <div className="mt-4 flex gap-3">
        <button type="submit" className="bg-ink text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors">
          {editing ? 'Save changes' : 'Add Transaction'}
        </button>
        {editing && (
          <button type="button" onClick={onCancel} className="text-sm text-slate-500 px-4 py-2.5 rounded-lg hover:bg-paper transition-colors">Cancel</button>
        )}
      </div>
    </form>
  );
}
