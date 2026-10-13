import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
export default function TrendChart({ data }) {
  return (
    <div className="bg-white border border-ledger rounded-xl p-6">
      <h3 className="font-display font-semibold text-ink mb-4">Income vs Expense Trend</h3>
      {data.length === 0 ? <p className="text-sm text-slate-400">No trend data yet.</p> : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7EAEF" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
            <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
            <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#0F9D6B" strokeWidth={2} name="Income" dot={false} />
            <Line type="monotone" dataKey="expense" stroke="#D64545" strokeWidth={2} name="Expense" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
