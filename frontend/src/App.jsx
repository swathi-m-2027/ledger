import { useEffect, useState, useCallback, useMemo } from 'react';
import { api } from './api';
import { useToast } from './components/Toast';
import { spentByCategory } from './budgetUtils';
import { monthKey, todayStr } from './dateUtils';
import SummaryCards from './components/SummaryCards';
import CategoryChart from './components/CategoryChart';
import TrendChart from './components/TrendChart';
import BudgetPanel from './components/BudgetPanel';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Login from './components/Login';

const inr = (v) => `₹${Math.round(v).toLocaleString('en-IN')}`;

export default function App() {
  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const lock = () => setLocked(true);
    window.addEventListener('ledger-unauthorized', lock);
    return () => window.removeEventListener('ledger-unauthorized', lock);
  }, []);

  const summary = useMemo(() => {
    const sum = (type) => transactions.filter((t) => t.type === type).reduce((s, t) => s + Number(t.amount), 0);
    const income = sum('income'), expense = sum('expense');
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const map = {};
    transactions.filter((t) => t.type === 'expense' && t.category)
      .forEach((t) => { map[t.category] = (map[t.category] || 0) + Number(t.amount); });
    return Object.entries(map).map(([category, total]) => ({ category, total })).sort((a, b) => b.total - a.total);
  }, [transactions]);

  const sync = useCallback(async () => {
    try {
      const [txns, trend] = await Promise.all([api.getTransactions(), api.getTrend()]);
      setTransactions(txns.map((t) => ({ ...t, amount: Number(t.amount) })));
      setTrendData(trend);
      setError(null);
    } catch (err) { if (err.message !== 'Login required') setError(err.message); }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [cats, buds] = await Promise.all([api.getCategories(), api.getBudgets()]);
        setCategories(cats);
        setBudgets(buds);
      } catch (err) { if (err.message !== 'Login required') setError(err.message); }
      await sync();
      setLoading(false);
    })();
  }, [sync]);

  const findCategory = (id) => categories.find((c) => String(c.id) === String(id));

  const checkBudgetAlert = (data) => {
    if (data.type !== 'expense' || !data.category_id) return;
    if (monthKey(data.txn_date) !== monthKey(todayStr())) return; // only this month's spending counts
    const budget = budgets.find((b) => String(b.category_id) === String(data.category_id) && b.monthly_limit);
    if (!budget) return;
    const before = spentByCategory(transactions)[budget.category] || 0;
    const after = before + data.amount;
    const limit = budget.monthly_limit;
    if (before <= limit && after > limit) toast(`Over budget! ${budget.category}: ${inr(after)} of ${inr(limit)}`, 'error');
    else if (before < limit * 0.8 && after >= limit * 0.8 && after <= limit) toast(`80% of your ${budget.category} budget is used`, 'warning');
  };

  const handleAdd = async (data) => {
    const tempId = `temp-${Date.now()}`;
    const cat = findCategory(data.category_id);
    setTransactions((p) => [{
      id: tempId, description: data.description, amount: data.amount, type: data.type,
      category: cat ? cat.name : null, category_id: cat ? cat.id : null, txn_date: data.txn_date,
    }, ...p]);
    checkBudgetAlert(data);
    try { await api.addTransaction(data); toast(data.type === 'income' ? 'Income added' : 'Expense added'); sync(); }
    catch (err) { setTransactions((p) => p.filter((t) => t.id !== tempId)); toast(`Could not add: ${err.message}`, 'error'); }
  };

  const handleUpdate = async (id, data) => {
    const backup = transactions;
    const cat = findCategory(data.category_id);
    setTransactions((p) => p.map((t) => (t.id === id ? {
      ...t, description: data.description, amount: data.amount, type: data.type,
      category: cat ? cat.name : null, category_id: cat ? cat.id : null, txn_date: data.txn_date,
    } : t)));
    setEditing(null);
    try { await api.updateTransaction(id, data); toast('Transaction updated'); sync(); }
    catch (err) { setTransactions(backup); toast(`Could not update: ${err.message}`, 'error'); }
  };

  const handleSubmit = (data) => (editing ? handleUpdate(editing.id, data) : handleAdd(data));

  const handleEdit = (t) => {
    setEditing(t);
    document.getElementById('txn-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleDelete = async (id) => {
    const backup = transactions;
    if (editing && editing.id === id) setEditing(null);
    setTransactions((p) => p.filter((t) => t.id !== id));
    try { await api.deleteTransaction(id); toast('Transaction deleted'); sync(); }
    catch (err) { setTransactions(backup); toast(`Could not delete: ${err.message}`, 'error'); }
  };

  const handleSaveBudget = async (categoryId, limit) => {
    const backup = budgets;
    setBudgets((p) => p.map((b) => (b.category_id === categoryId ? { ...b, monthly_limit: limit } : b)));
    try { await api.setBudget(categoryId, limit); toast('Budget saved'); }
    catch (err) { setBudgets(backup); toast(`Could not save budget: ${err.message}`, 'error'); }
  };

  const handleRemoveBudget = async (categoryId) => {
    const backup = budgets;
    setBudgets((p) => p.map((b) => (b.category_id === categoryId ? { ...b, monthly_limit: null } : b)));
    try { await api.removeBudget(categoryId); toast('Budget removed'); }
    catch (err) { setBudgets(backup); toast(`Could not remove budget: ${err.message}`, 'error'); }
  };

  if (locked) return <Login />;

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-ink text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gain flex items-center justify-center font-display font-bold text-ink">₹</div>
            <span className="font-display font-semibold text-lg tracking-tight">Ledger</span>
          </div>
          <span className="text-sm text-slate-300 hidden sm:block">Personal Finance Analytics</span>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">
        {error && <div className="bg-red-50 border border-loss/30 text-loss text-sm rounded-lg px-4 py-3">Couldn't reach the server: {error}</div>}
        {loading ? <p className="text-slate-400 text-sm">Loading your data…</p> : (
          <>
            <SummaryCards summary={summary} />
            {summary.expense > summary.income && <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3 animate-row-in">Heads up: your spending is higher than your income.</div>}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryChart data={categoryData} />
              <TrendChart data={trendData} />
            </div>
            <BudgetPanel budgets={budgets} transactions={transactions} onSave={handleSaveBudget} onRemove={handleRemoveBudget} />
            <TransactionForm categories={categories} onSubmit={handleSubmit} editing={editing} onCancel={() => setEditing(null)} />
            <TransactionList transactions={transactions} onDelete={handleDelete} onEdit={handleEdit} />
          </>
        )}
      </main>
    </div>
  );
}
