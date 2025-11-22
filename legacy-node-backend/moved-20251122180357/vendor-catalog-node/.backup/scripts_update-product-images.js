require('dotenv').config();
const mysql = require('mysql2/promise');
const path = require('path');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'Sidd@3185';
const DB_NAME = process.env.DB_NAME || 'vendor_catalog';

async function run() {
  const conn = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASS, database: DB_NAME });
  console.log('Connected to DB for product image updates');

  const mapping = {
    'Office Chair': '/images/products/product1.png',
    'Standing Desk': '/images/products/product2.png',
    'LED Lamp': '/images/products/product3.png',
    'Conference Mic': '/images/products/product4.png',
    'Notebook': '/images/products/product5.png',
    'Wireless Mouse': '/images/products/product6.png',
    'Mechanical Keyboard': '/images/products/product7.png',
    '24" Monitor': '/images/products/product8.png',
    'Office Desk': '/images/products/product9.png',
    'File Cabinet': '/images/products/product10.png'
  };

  for (const [name, pathVal] of Object.entries(mapping)) {
    const [r] = await conn.query('UPDATE products SET image_path = ? WHERE product_name = ?', [pathVal, name]);
    if (r.affectedRows) console.log(`Updated ${r.affectedRows} product(s) for "${name}"`);
  }

  await conn.end();
  console.log('Product image update complete');
}

run().catch(err=>{ console.error('Failed:', err.message); process.exit(1); });
