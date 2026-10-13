require('dotenv').config();
const { Pool } = require('pg');

// In the cloud we get one DATABASE_URL; on your own PC we use the separate DB_* settings.
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
