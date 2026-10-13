require('dotenv').config();
const { Pool, types } = require('pg');

// Return DATE columns as plain "YYYY-MM-DD" text, so a date never shifts by a day between time zones
types.setTypeParser(1082, (v) => v);

const config = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'financeapp',
    };

module.exports = new Pool(config);
