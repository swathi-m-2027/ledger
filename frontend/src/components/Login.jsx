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
    <div className="relative min-h-screen overflow-hidden bg-ink flex items-center justify-center px-6 py-10">
      <div className="absolute -left-24 -top-24 w-72 h-72 rounded-full bg-accent/30 blur-3xl" />
      <div className="absolute -right-20 bottom-0 w-80 h-80 rounded-full bg-gain/20 blur-3xl" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <form onSubmit={submit} className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/95 p-8 shadow-2xl shadow-black/30 backdrop-blur sm:p-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gain to-emerald-300 flex items-center justify-center font-display font-bold text-xl text-ink shadow-lg shadow-gain/20">₹</div>
            <div><span className="block font-display font-bold text-2xl tracking-tight text-ink">Ledger</span><span className="text-xs text-slate-400">Personal finance, simplified</span></div>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Private</span>
        </div>

        <div className="mb-6"><h1 className="font-display text-2xl font-semibold text-ink">Welcome back</h1><p className="mt-2 text-sm leading-6 text-slate-500">Enter your password to open your finances and pick up where you left off.</p></div>

        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500" htmlFor="ledger-password">Password</label>
        <div className="relative">
          <input id="ledger-password" type={showPassword ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Enter your password" autoFocus className="w-full rounded-xl border border-ledger bg-white px-4 py-3.5 pr-14 text-sm text-ink shadow-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" />
          <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-lg text-slate-400 transition hover:bg-paper hover:text-accent">{showPassword ? '◉' : '◌'}</button>
        </div>
        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-loss">{error}</p>}
        <button disabled={busy || !pw} className="mt-6 w-full rounded-xl bg-ink py-3.5 text-sm font-semibold text-white shadow-lg shadow-ink/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:translate-y-0 disabled:opacity-50">{busy ? 'Checking…' : 'Unlock my Ledger'}</button>
        <p className="mt-5 text-center text-xs text-slate-400">Your finance data stays protected behind your password.</p>
      </form>
    </div>
  );
}
