const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'Sidd@3185';
const DB_NAME = process.env.DB_NAME || 'vendor_catalog';

async function run(){
  const conn = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASS, database: DB_NAME });
  console.log('Connected for sample data');

  // check if vendors exist
  const [vrows] = await conn.query('SELECT COUNT(*) as c FROM vendors');
  if (vrows[0].c === 0) {
    const [r] = await conn.query('INSERT INTO vendors (vendor_name,address,gst_no,category,status) VALUES (?,?,?,?,?)', ['Acme Supplies','123 Market St','GSTIN1234','Office','active']);
    const vid = r.insertId;
    // insert several products with image paths
    const products = [
      ['Office Chair','Comfortable ergonomic chair',129.99,10,'/images/products/product1.svg'],
      ['Standing Desk','Height adjustable standing desk',399.00,2,'/images/products/product2.svg'],
      ['LED Lamp','Warm LED desk lamp',24.5,20,'/images/products/product3.svg'],
      ['Conference Mic','USB conference microphone',89.99,5,'/images/products/product4.svg']
    ];
    for (const p of products) {
      await conn.query('INSERT INTO products (vendor_id,product_name,description,price,moq,image_path) VALUES (?,?,?,?,?,?)', [vid, ...p]);
    }
    await conn.query('INSERT INTO vendor_contacts (vendor_id,name,phone,email,designation) VALUES (?,?,?,?,?)', [vid,'John Doe','+1234567890','john@acme.com','Sales Manager']);
    console.log('Inserted sample vendor, products, contact');
  } else console.log('Vendors present, skipping sample vendor');

  // Add more products if products table is sparse
  const [prodCountRows] = await conn.query('SELECT COUNT(*) as c FROM products');
  const prodCount = prodCountRows[0].c || 0;
  if (prodCount < 10) {
    // find any vendor id to attach extras
    const [vs] = await conn.query('SELECT id FROM vendors LIMIT 1');
    if (vs.length) {
      const vid = vs[0].id;
      const extra = [
        ['Notebook','A5 spiral-bound notebook',3.5,100,'/images/products/product5.svg'],
        ['Wireless Mouse','2.4GHz wireless optical mouse',12.99,50,'/images/products/product6.svg'],
        ['Mechanical Keyboard','RGB mechanical keyboard',69.99,10,'/images/products/product7.svg'],
        ['24" Monitor','24 inch Full HD monitor',159.99,5,'/images/products/product8.svg'],
        ['Office Desk','L-shaped wood office desk',249.00,2,'/images/products/product9.svg'],
        ['File Cabinet','Metal file cabinet - 3 drawers',79.99,5,'/images/products/product10.svg']
      ];
      for (const p of extra) {
        await conn.query('INSERT INTO products (vendor_id,product_name,description,price,moq,image_path) VALUES (?,?,?,?,?,?)', [vid, ...p]);
      }
      console.log('Inserted extra sample products');
    }
  } else console.log('Sufficient products present, skipping extra inserts');

  // create admin user if none
  const [urows] = await conn.query('SELECT COUNT(*) as c FROM users');
  if (urows[0].c === 0) {
    const pwd = await bcrypt.hash('admin123', 10);
    await conn.query('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)', ['Admin','admin@example.com',pwd,'admin']);
    console.log('Inserted admin user: admin@example.com / admin123');
  } else console.log('Users present, skipping user creation');

  await conn.end();
}

run().then(()=>console.log('Sample data init done')).catch(err=>{ console.error('Sample data failed', err.message); process.exit(1); });
