import AnimatedNumber from './AnimatedNumber';
const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(v));

function Card({ label, value, tone, hint, icon, eyebrow }) {
  const styles = {
    gain: { text: 'text-gain', wash: 'from-emerald-50 via-white to-white', border: 'border-emerald-100', icon: 'bg-emerald-100 text-gain', stripe: 'bg-gain' },
    loss: { text: 'text-loss', wash: 'from-rose-50 via-white to-white', border: 'border-rose-100', icon: 'bg-rose-100 text-loss', stripe: 'bg-loss' },
  }[tone];

  return <div className={`relative overflow-hidden rounded-2xl border ${styles.border} bg-gradient-to-br ${styles.wash} p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl`}><div className={`absolute left-0 top-0 h-full w-1 ${styles.stripe}`} /><div className="flex items-start justify-between"><div><span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">{label}</span><span className="mt-1 block text-xs text-slate-400">{eyebrow}</span></div><span className={`flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold shadow-sm ${styles.icon}`}>{icon}</span></div><span className={`mt-5 block font-mono text-3xl font-semibold tracking-tight tabular-nums ${styles.text}`}><AnimatedNumber value={value} formatFn={fmt} /></span><div className="mt-3 flex items-center gap-2 text-xs text-slate-500"><span className={`h-1.5 w-1.5 rounded-full ${styles.stripe}`} />{hint}</div></div>;
}

export default function SummaryCards({ summary }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><Card label="Net Balance" value={summary.balance} tone={summary.balance >= 0 ? 'gain' : 'loss'} eyebrow="Current position" hint="Income minus expenses" icon="₹" /><Card label="Total Income" value={summary.income} tone="gain" eyebrow="Money in" hint="All recorded income" icon="↗" /><Card label="Total Expense" value={summary.expense} tone="loss" eyebrow="Money out" hint="All recorded spending" icon="↘" /></div>;
}
