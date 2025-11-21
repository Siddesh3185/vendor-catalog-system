require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { init, getPool } = require('./db');

const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = process.env.PORT || process.env.SERVER_PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function serveStatic(req, res) {
  const parsed = url.parse(req.url);
  let pathname = parsed.pathname;
  if (pathname === '/') pathname = '/index.html';
  const file = path.join(PUBLIC_DIR, pathname);
  if (!file.startsWith(PUBLIC_DIR)) return false;
  fs.stat(file, (err, stat) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const stream = fs.createReadStream(file);
    const ext = path.extname(file);
    const mime = {
      '.html':'text/html', '.css':'text/css', '.js':'application/javascript', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg'
    }[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': mime });
    stream.pipe(res);
  });
  return true;
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      if (!body) return resolve(null);
      try { resolve(JSON.parse(body)); } catch (e) { resolve(null); }
    });
    req.on('error', reject);
  });
}

function notFound(res) { sendJSON(res, 404, { error: 'Not found' }); }

// Basic router for API endpoints
async function handleApi(req, res) {
  const parsed = url.parse(req.url, true);
  const parts = parsed.pathname.split('/').filter(Boolean); // removes empty
  const method = req.method;
  const pool = getPool();

  // helper: verify token from Authorization header or cookie
  async function verifyToken() {
    const auth = req.headers['authorization'] || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : (req.headers.cookie && req.headers.cookie.split('token=')[1]);
    if (!token) return null;
    const jwt = require('jsonwebtoken');
    try { return jwt.verify(token, JWT_SECRET); } catch (e) { return null; }
  }

  // /api/vendors
  if (parts[0] === 'api' && parts[1] === 'vendors') {
    const id = parts[2];
    if (method === 'GET' && !id) {
      // list vendors
      const [rows] = await pool.query('SELECT * FROM vendors ORDER BY id DESC');
      return sendJSON(res, 200, rows);
    }
    if (method === 'POST' && !id) {
      const body = await parseBody(req);
      // require auth for create
      const user = await verifyToken();
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });
      const { vendor_name, address, gst_no, category, status } = body || {};
      if (!vendor_name || vendor_name.trim().length < 2) return sendJSON(res, 400, { error: 'vendor_name is required' });
      const [result] = await pool.query('INSERT INTO vendors (vendor_name,address,gst_no,category,status) VALUES (?,?,?,?,?)', [vendor_name,address,gst_no,category,status||'active']);
      // log activity
      await pool.query('INSERT INTO activity_logs (user_id, description) VALUES (?,?)', [user.id, `Created vendor ${vendor_name} (id:${result.insertId})`]);
      return sendJSON(res, 201, { id: result.insertId });
    }
    if (id && method === 'GET') {
      const [vendors] = await pool.query('SELECT * FROM vendors WHERE id = ?', [id]);
      if (!vendors.length) return sendJSON(res, 404, { error: 'Vendor not found' });
      const vendor = vendors[0];
      const [products] = await pool.query('SELECT * FROM products WHERE vendor_id = ?', [id]);
      const [contacts] = await pool.query('SELECT * FROM vendor_contacts WHERE vendor_id = ?', [id]);
      vendor.products = products;
      vendor.contacts = contacts;
      return sendJSON(res, 200, vendor);
    }
    if (id && method === 'PUT') {
      const user = await verifyToken();
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });
      const body = await parseBody(req);
      const { vendor_name, address, gst_no, category, status } = body || {};
      if (!vendor_name || vendor_name.trim().length < 2) return sendJSON(res, 400, { error: 'vendor_name is required' });
      await pool.query('UPDATE vendors SET vendor_name=?,address=?,gst_no=?,category=?,status=? WHERE id=?', [vendor_name,address,gst_no,category,status||'active',id]);
      await pool.query('INSERT INTO activity_logs (user_id, description) VALUES (?,?)', [user.id, `Updated vendor ${vendor_name} (id:${id})`]);
      return sendJSON(res, 200, { ok: true });
    }
    if (id && method === 'DELETE') {
      const user = await verifyToken();
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });
      // fetch vendor name for log
      const [v] = await pool.query('SELECT vendor_name FROM vendors WHERE id=?', [id]);
      const name = (v[0] && v[0].vendor_name) || id;
      await pool.query('DELETE FROM vendors WHERE id=?', [id]);
      await pool.query('INSERT INTO activity_logs (user_id, description) VALUES (?,?)', [user.id, `Deleted vendor ${name} (id:${id})`]);
      return sendJSON(res, 200, { ok: true });
    }
  }

  // /api/products
  if (parts[0] === 'api' && parts[1] === 'products') {
    const id = parts[2];
    if (method === 'GET' && !id) {
      const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
      return sendJSON(res, 200, rows);
    }
    if (method === 'POST' && !id) {
      const user = await verifyToken();
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });
      const body = await parseBody(req);
      const { vendor_id, product_name, description, price, moq } = body || {};
      if (!product_name || product_name.trim().length < 2) return sendJSON(res, 400, { error: 'product_name is required' });
      if (!vendor_id) return sendJSON(res, 400, { error: 'vendor_id is required' });
      const [result] = await pool.query('INSERT INTO products (vendor_id,product_name,description,price,moq) VALUES (?,?,?,?,?)', [vendor_id,product_name,description,price,moq]);
      await pool.query('INSERT INTO activity_logs (user_id, description) VALUES (?,?)', [user.id, `Created product ${product_name} (id:${result.insertId}) for vendor ${vendor_id}`]);
      return sendJSON(res, 201, { id: result.insertId });
    }
    if (id && method === 'GET') {
      const [rows] = await pool.query('SELECT * FROM products WHERE id=?', [id]);
      if (!rows.length) return sendJSON(res, 404, { error: 'Product not found' });
      return sendJSON(res, 200, rows[0]);
    }
    if (id && method === 'PUT') {
      const user = await verifyToken();
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });
      const body = await parseBody(req);
      const { vendor_id, product_name, description, price, moq } = body || {};
      if (!product_name || product_name.trim().length < 2) return sendJSON(res, 400, { error: 'product_name is required' });
      await pool.query('UPDATE products SET vendor_id=?,product_name=?,description=?,price=?,moq=? WHERE id=?', [vendor_id,product_name,description,price,moq,id]);
      await pool.query('INSERT INTO activity_logs (user_id, description) VALUES (?,?)', [user.id, `Updated product ${product_name} (id:${id})`]);
      return sendJSON(res, 200, { ok: true });
    }
    if (id && method === 'DELETE') {
      const user = await verifyToken();
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });
      const [p] = await pool.query('SELECT product_name FROM products WHERE id=?', [id]);
      const pname = (p[0] && p[0].product_name) || id;
      await pool.query('DELETE FROM products WHERE id=?', [id]);
      await pool.query('INSERT INTO activity_logs (user_id, description) VALUES (?,?)', [user.id, `Deleted product ${pname} (id:${id})`]);
      return sendJSON(res, 200, { ok: true });
    }
  }

  // /api/contacts
  if (parts[0] === 'api' && (parts[1] === 'contacts' || parts[1] === 'vendor_contacts')) {
    const id = parts[2];
    if (method === 'GET' && !id) {
      const [rows] = await pool.query('SELECT * FROM vendor_contacts ORDER BY id DESC');
      return sendJSON(res, 200, rows);
    }
    if (method === 'POST' && !id) {
      const user = await verifyToken();
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });
      const body = await parseBody(req);
      const { vendor_id, name, phone, email, designation } = body || {};
      if (!name || name.trim().length < 2) return sendJSON(res, 400, { error: 'name is required' });
      if (!vendor_id) return sendJSON(res, 400, { error: 'vendor_id is required' });
      const [result] = await pool.query('INSERT INTO vendor_contacts (vendor_id,name,phone,email,designation) VALUES (?,?,?,?,?)', [vendor_id,name,phone,email,designation]);
      await pool.query('INSERT INTO activity_logs (user_id, description) VALUES (?,?)', [user.id, `Created contact ${name} (id:${result.insertId}) for vendor ${vendor_id}`]);
      return sendJSON(res, 201, { id: result.insertId });
    }
    if (id && method === 'GET') {
      const [rows] = await pool.query('SELECT * FROM vendor_contacts WHERE id=?', [id]);
      if (!rows.length) return sendJSON(res, 404, { error: 'Contact not found' });
      return sendJSON(res, 200, rows[0]);
    }
    if (id && method === 'PUT') {
      const user = await verifyToken();
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });
      const body = await parseBody(req);
      const { vendor_id, name, phone, email, designation } = body || {};
      if (!name || name.trim().length < 2) return sendJSON(res, 400, { error: 'name is required' });
      await pool.query('UPDATE vendor_contacts SET vendor_id=?,name=?,phone=?,email=?,designation=? WHERE id=?', [vendor_id,name,phone,email,designation,id]);
      await pool.query('INSERT INTO activity_logs (user_id, description) VALUES (?,?)', [user.id, `Updated contact ${name} (id:${id})`]);
      return sendJSON(res, 200, { ok: true });
    }
    if (id && method === 'DELETE') {
      const user = await verifyToken();
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });
      const [c] = await pool.query('SELECT name FROM vendor_contacts WHERE id=?', [id]);
      const cname = (c[0] && c[0].name) || id;
      await pool.query('DELETE FROM vendor_contacts WHERE id=?', [id]);
      await pool.query('INSERT INTO activity_logs (user_id, description) VALUES (?,?)', [user.id, `Deleted contact ${cname} (id:${id})`]);
      return sendJSON(res, 200, { ok: true });
    }
  }

  // auth: POST /api/login
  if (parts[0] === 'api' && parts[1] === 'login' && method === 'POST') {
    const body = await parseBody(req) || {};
    const { email, password } = body;
    if (!email || !password) return sendJSON(res, 400, { error: 'Email and password required' });
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return sendJSON(res, 401, { error: 'Invalid credentials' });
    const user = rows[0];
    const bcrypt = require('bcryptjs');
    const ok = await bcrypt.compare(password, user.password || '');
    if (!ok) return sendJSON(res, 401, { error: 'Invalid credentials' });
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    return sendJSON(res, 200, { token });
  }

  // nothing matched
  return notFound(res);
}

const server = http.createServer(async (req, res) => {
  try {
    // serve static if path not starting with /api
    if (!req.url.startsWith('/api')) {
      const ok = serveStatic(req, res);
      if (ok) return;
      // else fallthrough to 404
      res.writeHead(404); res.end('Not Found'); return;
    }
    await handleApi(req, res);
  } catch (err) {
    console.error('Server error', err);
    sendJSON(res, 500, { error: 'Server error' });
  }
});

init().then(() => {
  server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}).catch(err => {
  console.error('Init failed', err);
  server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT} (DB init failed)`));
});
