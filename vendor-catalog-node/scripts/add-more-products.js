require('dotenv').config();
const mysql = require('mysql2/promise');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'Sidd@3185';
const DB_NAME = process.env.DB_NAME || 'vendor_catalog';

async function run(){
  const conn = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASS, database: DB_NAME });
  console.log('Connected to DB to add more products');

  // find a vendor to attach products to
  const [vendors] = await conn.query('SELECT id FROM vendors LIMIT 1');
  if (!vendors.length) { console.log('No vendors found - please create a vendor first'); await conn.end(); return; }
  const vendorId = vendors[0].id;

  const extras = [
    ['Desk Organizer','Keep desktop tidy and organized',7.99,50,'/images/products/product11.svg'],
    ['Sticky Notes Pack','Assorted sticky notes',2.49,200,'/images/products/product12.svg'],
    ['Paper Ream A4','500 sheets A4 copy paper',5.99,30,'/images/products/product13.svg'],
    ['Ink Cartridge Black','Compatible printer ink',14.99,40,'/images/products/product14.svg'],
    ['Clip Binder','Durable clip binder for files',3.99,100,'/images/products/product15.svg'],
    // additional product names
    ['Stapler','Heavy duty stapler',6.49,80,null],
    ['Scissors','Office scissors 8-inch',4.99,100,null],
    ['Highlighter Set','Assorted highlighters pack',3.99,150,null],
    ['Whiteboard Markers','Set of 6 dry-erase markers',5.49,120,null],
    ['Desk Mat','Leatherette desk mat',19.99,20,null],
    ['Pen Set','Ballpoint pen set (10 pcs)',9.99,200,null],
    ['USB Hub','4-port USB 3.0 hub',12.99,40,null],
    ['External HDD 1TB','Portable external hard drive 1TB',49.99,10,null],
    ['Laptop Stand','Aluminum laptop stand',29.99,15,null],
    ['Monitor Arm','Adjustable monitor arm',39.99,10,null],
    ['Headphones','Over-ear wired headphones',24.99,30,null],
    ['Webcam','1080p USB webcam',34.99,25,null],
    ['Cable Organizer','Desk cable organizer',2.99,300,null],
    ['Mouse Pad','Large cloth mouse pad',4.49,200,null],
    ['Calculator','Basic desktop calculator',7.99,100,null]
  ];

  for (const [name, desc, price, moq, img] of extras) {
    // avoid duplicates by name
    const [rows] = await conn.query('SELECT id FROM products WHERE product_name = ?', [name]);
    if (rows.length) { console.log(`Skipping existing product: ${name}`); continue; }
    const [r] = await conn.query('INSERT INTO products (vendor_id, product_name, description, price, moq, image_path) VALUES (?,?,?,?,?,?)', [vendorId, name, desc, price, moq, img]);
    console.log(`Inserted product ${name} (id:${r.insertId})`);
  }

  await conn.end();
  console.log('Done adding extra products');
}

run().catch(err=>{ console.error('Failed:', err.message); process.exit(1); });
