CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income','expense'))
);
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  description VARCHAR(150) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income','expense')),
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  txn_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
INSERT INTO categories (name, type) VALUES
  ('Salary','income'),('Freelance','income'),('Rent','expense'),('Groceries','expense'),
  ('Transport','expense'),('Utilities','expense'),('Entertainment','expense'),('Healthcare','expense')
ON CONFLICT (name) DO NOTHING;
