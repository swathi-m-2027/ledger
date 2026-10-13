import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
export default function CategoryChart({ data }) {
  return (
    <div className="bg-white border border-ledger rounded-xl p-6">
      <h3 className="font-display font-semibold text-ink mb-4">Spending by Category</h3>
      {data.length === 0 ? <p className="text-sm text-slate-400">No expense data yet.</p> : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7EAEF" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#64748B' }} />
            <YAxis type="category" dataKey="category" width={100} tick={{ fontSize: 12, fill: '#0F172A' }} />
            <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Spent']} />
            <Bar dataKey="total" fill="#4F5FEA" radius={[0, 4, 4, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
