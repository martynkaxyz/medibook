const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

pool.on('connect', () => {
  console.log('Polaczono z baza danych');
});

pool.on('error', (err) => {
  console.error('Blad polaczenia z baza:', err);
  process.exit(-1);
});

module.exports = pool;