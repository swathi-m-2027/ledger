import { monthLabel } from '../dateUtils';

const arrow = 'w-9 h-9 flex items-center justify-center rounded-lg border border-ledger bg-white text-ink hover:bg-paper transition-colors disabled:opacity-30 disabled:hover:bg-white';

export default function PeriodBar({ period, options, onChange }) {
  const idx = options.indexOf(period);
  const olderDisabled = period === 'all' || idx === options.length - 1;
  const newerDisabled = period === 'all' || idx === 0;

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h2 className="font-display font-semibold text-ink text-xl">
          {period === 'all' ? 'All time' : monthLabel(period)}
        </h2>
        <p className="text-xs text-slate-400">Cards, spending chart and transactions follow this period</p>
      </div>
      <div className="flex items-center gap-2">
        <button className={arrow} disabled={olderDisabled} onClick={() => onChange(options[idx + 1])} aria-label="Previous month">‹</button>
        <select
          value={period}
          onChange={(e) => onChange(e.target.value)}
          className="border border-ledger rounded-lg px-3 h-9 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="all">All time</option>
          {options.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
        </select>
        <button className={arrow} disabled={newerDisabled} onClick={() => onChange(options[idx - 1])} aria-label="Next month">›</button>
      </div>
    </div>
  );
}
