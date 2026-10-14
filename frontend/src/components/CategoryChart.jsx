import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function CategoryChart({ title, data, color = '#4F5FEA', label = 'Total', emptyText = 'No data yet.' }) {
  // Grow the chart with the number of categories so every name stays readable
  const height = Math.max(260, data.length * 34 + 40);
  return (
    <div className="bg-white border border-ledger rounded-xl p-6">
      <h3 className="font-display font-semibold text-ink mb-4">{title}</h3>
      {data.length === 0 ? <p className="text-sm text-slate-400">{emptyText}</p> : (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7EAEF" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#64748B' }} />
            <YAxis type="category" dataKey="category" width={110} interval={0} tick={{ fontSize: 12, fill: '#0F172A' }} />
            <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, label]} />
            <Bar dataKey="total" fill={color} radius={[0, 4, 4, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
