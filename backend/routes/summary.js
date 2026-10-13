const router = require('express').Router();
const pool = require('../db');

router.get('/trend', async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT TO_CHAR(DATE_TRUNC('month', txn_date),'Mon YYYY') AS month,
             DATE_TRUNC('month', txn_date) AS sort_key,
             SUM(amount) FILTER (WHERE type='income') AS income,
             SUM(amount) FILTER (WHERE type='expense') AS expense
      FROM transactions
      WHERE txn_date >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY sort_key ORDER BY sort_key`);
    res.json(r.rows.map(x => ({ month: x.month, income: parseFloat(x.income || 0), expense: parseFloat(x.expense || 0) })));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to fetch trend' }); }
});
module.exports = router;
