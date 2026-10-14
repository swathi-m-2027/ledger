import AnimatedNumber from './AnimatedNumber';
const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(v));

function Card({ label, value, tone, hint, icon }) {
  const styles = {
    gain: { text: 'text-gain', wash: 'from-green-50 to-white', ring: 'ring-green-100', icon: 'bg-green-100 text-gain' },
    loss: { text: 'text-loss', wash: 'from-red-50 to-white', ring: 'ring-red-100', icon: 'bg-red-100 text-loss' },
  }[tone];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${styles.wash} border border-ledger rounded-2xl p-5 flex flex-col gap-3 ring-1 ${styles.ring} hover:-translate-y-0.5 hover:shadow-lg transition-all animate-card-pulse`}>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{label}</span>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${styles.icon}`}>{icon}</span>
      </div>
      <span className={`font-mono text-2xl font-semibold tabular-nums ${styles.text}`}><AnimatedNumber value={value} formatFn={fmt} /></span>
      <span className="text-xs text-slate-500">{hint}</span>
      <div className={`absolute -right-8 -bottom-10 w-28 h-28 rounded-full opacity-40 ${styles.icon}`} />
    </div>
  );
}

export default function SummaryCards({ summary }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card label="Net Balance" value={summary.balance} tone={summary.balance >= 0 ? 'gain' : 'loss'} hint="Income minus expenses" icon="₹" />
      <Card label="Total Income" value={summary.income} tone="gain" hint="All recorded income" icon="↗" />
      <Card label="Total Expense" value={summary.expense} tone="loss" hint="All recorded spending" icon="↘" />
    </div>
  );
}
