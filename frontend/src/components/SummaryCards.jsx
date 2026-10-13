import AnimatedNumber from './AnimatedNumber';
const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(v));
function Card({ label, value, tone, hint }) {
  const color = { gain: 'text-gain', loss: 'text-loss' }[tone];
  return (
    <div key={value} className="bg-white border border-ledger rounded-xl p-6 flex flex-col gap-2 hover:shadow-md transition-shadow animate-card-pulse">
      <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">{label}</span>
      <span className={`font-mono text-2xl font-semibold tabular-nums ${color}`}><AnimatedNumber value={value} formatFn={fmt} /></span>
      <span className="text-xs text-slate-400">{hint}</span>
    </div>
  );
}
export default function SummaryCards({ summary }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card label="Net Balance" value={summary.balance} tone={summary.balance >= 0 ? 'gain' : 'loss'} hint="Income minus expenses" />
      <Card label="Total Income" value={summary.income} tone="gain" hint="All recorded income" />
      <Card label="Total Expense" value={summary.expense} tone="loss" hint="All recorded spending" />
    </div>
  );
}
