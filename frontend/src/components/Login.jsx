import { useState } from 'react';
import { api, setPassword } from '../api';

export default function Login() {
  const [pw, setPw] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      <form onSubmit={submit} className="bg-white rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4 shadow-2xl shadow-black/20">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gain flex items-center justify-center font-display font-bold text-ink">₹</div>
          <span className="font-display font-semibold text-xl text-ink">Ledger</span>
        </div>
        <p className="text-sm text-slate-500">Enter your password to open your finances.</p>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full border border-ledger rounded-lg pl-3 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md text-slate-400 hover:text-accent hover:bg-paper transition-colors"
          >
            {showPassword ? '◉' : '◌'}
          </button>
        </div>
        {error && <p className="text-sm text-loss">{error}</p>}
        <button disabled={busy || !pw} className="bg-ink text-white text-sm font-medium py-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50">
          {busy ? 'Checking…' : 'Unlock'}
        </button>
      </form>
    </div>
  );
}
