const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sidd@3185",
    database: "vendor_catalog"
});

db.connect((err) => {
    if (err) {
        console.warn('Warning: MySQL connection failed -', err.message);
        // Do not throw here to allow the app to run without a DB during development.
        return;
    }
    console.log("MySQL Connected");
});

module.exports = db;
