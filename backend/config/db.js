const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
  console.log('Polaczono z baza danych');
});

pool.on('error', (err) => {
  console.error('Blad polaczenia z baza:', err);
  process.exit(-1);
});

module.exports = pool;