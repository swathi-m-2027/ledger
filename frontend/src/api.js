const BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

export const getPassword = () => localStorage.getItem('ledger_pw') || '';
export const setPassword = (p) => localStorage.setItem('ledger_pw', p);
export const clearPassword = () => localStorage.removeItem('ledger_pw');

async function handle(res) {
  if (res.status === 401) {
    window.dispatchEvent(new Event('ledger-unauthorized'));
    throw new Error('Login required');
  }
  if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b.error || `Request failed (${res.status})`); }
  return res.json();
}

const req = (path, method = 'GET', body) =>
  fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'x-app-password': getPassword(), ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  }).then(handle);

export const api = {
  login: async (password) => {
    const res = await fetch(`${BASE_URL}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    if (!res.ok) throw new Error('Wrong password');
    return res.json();
  },
  getTrend: () => req('/summary/trend'),
  getTransactions: () => req('/transactions'),
  getCategories: () => req('/transactions/categories'),
  addCategory: (data) => req('/transactions/categories', 'POST', data),
  deleteCategory: (id) => req(`/transactions/categories/${id}`, 'DELETE'),
  addTransaction: (data) => req('/transactions', 'POST', data),
  updateTransaction: (id, data) => req(`/transactions/${id}`, 'PUT', data),
  deleteTransaction: (id) => req(`/transactions/${id}`, 'DELETE'),
  getBudgets: () => req('/budgets'),
  setBudget: (categoryId, limit) => req(`/budgets/${categoryId}`, 'PUT', { monthly_limit: limit }),
  removeBudget: (categoryId) => req(`/budgets/${categoryId}`, 'DELETE'),
};
