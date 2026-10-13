const router = require('express').Router();
const pool = require('../db');

// All expense categories, with their monthly limit (null if none set)
router.get('/', async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT c.id AS category_id, c.name AS category, b.monthly_limit
      FROM categories c LEFT JOIN budgets b ON b.category_id = c.id
      WHERE c.type = 'expense' ORDER BY c.name`);
    res.json(r.rows.map((x) => ({ ...x, monthly_limit: x.monthly_limit === null ? null : parseFloat(x.monthly_limit) })));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to fetch budgets' }); }
});

// Create or update a budget for one category
router.put('/:categoryId', async (req, res) => {
  const limit = parseFloat(req.body.monthly_limit);
  if (!limit || limit <= 0) return res.status(400).json({ error: 'monthly_limit must be a positive number' });
  try {
    await pool.query(
      `INSERT INTO budgets (category_id, monthly_limit) VALUES ($1, $2)
       ON CONFLICT (category_id) DO UPDATE SET monthly_limit = EXCLUDED.monthly_limit`,
      [req.params.categoryId, limit]);
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to save budget' }); }
});

router.delete('/:categoryId', async (req, res) => {
  try {
    await pool.query('DELETE FROM budgets WHERE category_id = $1', [req.params.categoryId]);
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to remove budget' }); }
});

module.exports = router;
