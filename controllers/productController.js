const Product = require('../models/Product');

exports.list = (req, res) => {
  Product.getAll((err, rows) => {
    res.render('products/list', { products: rows });
  });
};

exports.renderAdd = (req, res) => {
  res.render('products/add');
};

exports.add = (req, res) => {
  Product.add(req.body, () => res.redirect('/products'));
};

exports.renderEdit = (req, res) => {
  const id = req.params.id;
  Product.getById(id, (err, rows) => {
    const product = (rows && rows[0]) || null;
    res.render('products/edit', { product });
  });
};

exports.update = (req, res) => {
  Product.update(req.params.id, req.body, () => res.redirect('/products'));
};

exports.delete = (req, res) => {
  Product.delete(req.params.id, () => res.redirect('/products'));
};
