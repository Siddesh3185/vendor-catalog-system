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
    // insert a single sample product (no image_path)
    await conn.query('INSERT INTO products (vendor_id,product_name,description,price,moq) VALUES (?,?,?,?,?)', [vid,'Office Chair','Comfortable ergonomic chair',129.99,10]);
    await conn.query('INSERT INTO vendor_contacts (vendor_id,name,phone,email,designation) VALUES (?,?,?,?,?)', [vid,'John Doe','+1234567890','john@acme.com','Sales Manager']);
    console.log('Inserted sample vendor, product, contact');
  } else console.log('Vendors present, skipping sample vendor');
  

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
