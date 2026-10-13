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
INSERT INTO transactions (description, amount, type, category_id, txn_date) VALUES
  ('Monthly salary',65000,'income',1,CURRENT_DATE - INTERVAL '3 days'),
  ('Website project',15000,'income',2,CURRENT_DATE - INTERVAL '10 days'),
  ('Apartment rent',20000,'expense',3,CURRENT_DATE - INTERVAL '2 days'),
  ('Supermarket',4200,'expense',4,CURRENT_DATE - INTERVAL '1 days'),
  ('Metro card top-up',800,'expense',5,CURRENT_DATE - INTERVAL '4 days'),
  ('Electricity bill',2100,'expense',6,CURRENT_DATE - INTERVAL '6 days'),
  ('Movie night',600,'expense',7,CURRENT_DATE - INTERVAL '5 days');
