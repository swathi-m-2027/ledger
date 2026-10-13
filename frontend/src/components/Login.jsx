import { useState } from 'react';
import { api, setPassword } from '../api';

export default function Login() {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.login(pw);
      setPassword(pw);
      window.location.reload();
    } catch {
      setError('Wrong password. Try again.');
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <form onSubmit={submit} className="bg-white rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gain flex items-center justify-center font-display font-bold text-ink">₹</div>
          <span className="font-display font-semibold text-xl text-ink">Ledger</span>
        </div>
        <p className="text-sm text-slate-500">Enter your password to open your finances.</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          autoFocus
          className="border border-ledger rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {error && <p className="text-sm text-loss">{error}</p>}
        <button disabled={busy || !pw} className="bg-ink text-white text-sm font-medium py-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50">
          {busy ? 'Checking…' : 'Unlock'}
        </button>
      </form>
    </div>
  );
}
