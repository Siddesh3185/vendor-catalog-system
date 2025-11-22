const mysql = require('mysql2/promise');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'Sidd@3185';
const DB_NAME = process.env.DB_NAME || 'vendor_catalog';

async function run() {
  const conn = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASS });
  console.log('Connected to MySQL (for init)');

  // Create database if not exists
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  console.log('Database ensured:', DB_NAME);

  // Use the database for subsequent statements
  await conn.query(`USE \`${DB_NAME}\``);

  // Create tables
  const stmts = [
`CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('admin','staff') DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
`CREATE TABLE IF NOT EXISTS vendors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vendor_name VARCHAR(150) NOT NULL,
  address TEXT,
  gst_no VARCHAR(20),
  category VARCHAR(50),
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
`CREATE TABLE IF NOT EXISTS vendor_contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vendor_id INT,
  name VARCHAR(100),
  phone VARCHAR(15),
  email VARCHAR(100),
  designation VARCHAR(100),
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);`,
`CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vendor_id INT,
  product_name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  moq INT,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);`,
`CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);`
  ];

  for (const s of stmts) {
    await conn.query(s);
  }

  console.log('All tables created/ensured.');
  // Ensure products table has image_path column (for product images)
  const [cols] = await conn.query("SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products' AND COLUMN_NAME = 'image_path'", [DB_NAME]);
  if (!cols.length) {
    await conn.query("ALTER TABLE products ADD COLUMN image_path VARCHAR(255) NULL");
    console.log('Added products.image_path column');
  }
  await conn.end();
}

run().then(()=>console.log('Schema initialization complete')).catch(err=>{ console.error('Schema init failed:', err.message); process.exit(1); });
