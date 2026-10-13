const router = require('express').Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const r = await pool.query(`SELECT t.id, t.description, t.amount, t.type, t.txn_date, c.name AS category
      FROM transactions t LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY t.txn_date DESC, t.id DESC`);
    res.json(r.rows);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to fetch transactions' }); }
});

router.get('/categories', async (req, res) => {
  try { res.json((await pool.query('SELECT id, name, type FROM categories ORDER BY name')).rows); }
  catch (e) { console.error(e); res.status(500).json({ error: 'Failed to fetch categories' }); }
});

router.post('/', async (req, res) => {
  const { description, amount, type, category_id, txn_date } = req.body;
  if (!description || !amount || !['income', 'expense'].includes(type))
    return res.status(400).json({ error: 'description, amount and a valid type are required' });
  try {
    const r = await pool.query(
      `INSERT INTO transactions (description, amount, type, category_id, txn_date)
       VALUES ($1,$2,$3,$4,COALESCE($5, CURRENT_DATE)) RETURNING *`,
      [description, amount, type, category_id || null, txn_date || null]);
    res.status(201).json(r.rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to create transaction' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const r = await pool.query('DELETE FROM transactions WHERE id=$1 RETURNING id', [req.params.id]);
    if (!r.rowCount) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to delete' }); }
});
module.exports = router;
