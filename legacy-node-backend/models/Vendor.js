const db = require("../config/db");

module.exports = {
    getAll: (callback) => {
        db.query("SELECT * FROM vendors", callback);
    },

    add: (data, callback) => {
        db.query("INSERT INTO vendors SET ?", data, callback);
    },

    update: (id, data, callback) => {
        db.query("UPDATE vendors SET ? WHERE id = ?", [data, id], callback);
    },

    delete: (id, callback) => {
        db.query("DELETE FROM vendors WHERE id = ?", [id], callback);
    }
,
    getById: (id, callback) => {
        db.query("SELECT * FROM vendors WHERE id = ?", [id], callback);
    }
};
