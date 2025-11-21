const Vendor = require("../models/Vendor");

exports.list = (req, res) => {
    Vendor.getAll((err, rows) => {
        res.render("vendors/list", { vendors: rows });
    });
};

exports.add = (req, res) => {
    Vendor.add(req.body, () => {
        res.redirect("/vendors");
    });
};

exports.renderAdd = (req, res) => {
    res.render('vendors/add');
};

exports.renderEdit = (req, res) => {
    const id = req.params.id;
    Vendor.getById(id, (err, rows) => {
        const vendor = (rows && rows[0]) || null;
        res.render('vendors/edit', { vendor });
    });
};

exports.update = (req, res) => {
    Vendor.update(req.params.id, req.body, () => {
        res.redirect("/vendors");
    });
};

exports.delete = (req, res) => {
    Vendor.delete(req.params.id, () => {
        res.redirect("/vendors");
    });
};
