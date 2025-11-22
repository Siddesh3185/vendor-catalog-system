const db = require("../config/db");

module.exports = {
    getAll: (callback) => db.query("SELECT * FROM contacts", callback),
    add: (data, callback) => db.query("INSERT INTO contacts SET ?", data, callback),
    update: (id, data, callback) => db.query("UPDATE contacts SET ? WHERE id = ?", [data, id], callback),
    delete: (id, callback) => db.query("DELETE FROM contacts WHERE id = ?", [id], callback),
    getById: (id, callback) => db.query("SELECT * FROM contacts WHERE id = ?", [id], callback)
};
