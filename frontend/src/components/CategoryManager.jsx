import { useState } from 'react';

const input = 'border border-ledger rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent';

function Group({ title, items, color, onDelete, icon }) {
  return <div><p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-2"><span>{icon}</span>{title}</p><div className="flex flex-wrap gap-2">{items.length === 0 && <span className="text-sm text-slate-400">None yet</span>}{items.map((c) => <span key={c.id} className={`inline-flex items-center gap-2 text-sm rounded-full pl-3 pr-2 py-1 border shadow-sm ${color}`}>{c.name}<button onClick={() => onDelete(c)} className="w-5 h-5 rounded-full hover:bg-black/10 text-xs leading-none" aria-label={`Delete ${c.name}`}>✕</button></span>)}</div></div>;
}

export default function CategoryManager({ categories, onAdd, onDelete }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const submit = async (e) => { e.preventDefault(); if (!name.trim()) return; const ok = await onAdd({ name: name.trim(), type }); if (ok) setName(''); };

  return <div className="bg-white border border-ledger rounded-2xl p-6 shadow-sm"><h3 className="font-display font-semibold text-ink mb-4">Categories</h3><div className="flex flex-col gap-4 mb-5"><Group title="Expense" items={categories.filter((c) => c.type === 'expense')} color="border-red-200 bg-red-50 text-loss" icon="↘" onDelete={onDelete} /><Group title="Income" items={categories.filter((c) => c.type === 'income')} color="border-green-200 bg-green-50 text-gain" icon="↗" onDelete={onDelete} /></div><form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-ledger"><input className={`${input} sm:flex-1`} value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name, e.g. Fuel" maxLength={50} required /><select className={input} value={type} onChange={(e) => setType(e.target.value)}><option value="expense">Expense</option><option value="income">Income</option></select><button type="submit" className="bg-ink text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-slate-800 transition-colors">Add category</button></form></div>;
}
