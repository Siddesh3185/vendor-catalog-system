const mysql = require('mysql2/promise');

// Use environment variables if present, else fall back to provided credentials
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'Sidd@3185';
const DB_NAME = process.env.DB_NAME || 'vendor_catalog';

let pool;

async function init() {
  pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // quick test
  try {
    const [rows] = await pool.query('SELECT 1');
    console.log('MySQL pool created');
  } catch (err) {
    console.error('MySQL connection failed -', err.message);
  }
}

function getPool() {
  if (!pool) throw new Error('DB not initialized');
  return pool;
}

module.exports = { init, getPool };
