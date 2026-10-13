require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const auth = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/login', (req, res) => {
  const pw = process.env.APP_PASSWORD;
  if (!pw || req.body.password === pw) return res.json({ ok: true });
  res.status(401).json({ error: 'Wrong password' });
});

app.use('/api/transactions', auth, require('./routes/transactions'));
app.use('/api/summary', auth, require('./routes/summary'));
app.use('/api/budgets', auth, require('./routes/budgets'));

// Serve the built website (frontend/dist) from the same address
const dist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));

pool.query(`
  CREATE TABLE IF NOT EXISTS budgets (
    category_id INTEGER PRIMARY KEY REFERENCES categories(id) ON DELETE CASCADE,
    monthly_limit NUMERIC(12,2) NOT NULL CHECK (monthly_limit > 0)
  )
`).then(() => console.log('Budgets table ready'))
  .catch((err) => console.error('Could not create budgets table:', err.message));
