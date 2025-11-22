Vendor Catalog (Node-only, manual routing)

Run:
1. Ensure MySQL is running and you executed the provided SQL schema to create the database and tables.
2. From project root run:

   cd vendor-catalog-node
   npm install
   node server.js

3. Open http://localhost:4000 in your browser.

Notes:
- The server uses the MySQL credentials hardcoded by default: user `root`, password `Sidd@3185`, database `vendor_catalog`. You can override using env vars `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`.
- This project uses no frameworks; routing is implemented using Node's `http` module and `mysql2/promise` for DB access.
