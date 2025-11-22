const Contact = require('../models/Contact');

exports.list = (req, res) => {
  Contact.getAll((err, rows) => {
    res.render('contacts/list', { contacts: rows });
  });
};

exports.renderAdd = (req, res) => {
  res.render('contacts/add');
};

exports.add = (req, res) => {
  Contact.add(req.body, () => res.redirect('/contacts'));
};

exports.renderEdit = (req, res) => {
  const id = req.params.id;
  Contact.getById(id, (err, rows) => {
    const contact = (rows && rows[0]) || null;
    res.render('contacts/edit', { contact });
  });
};

exports.update = (req, res) => {
  Contact.update(req.params.id, req.body, () => res.redirect('/contacts'));
};

exports.delete = (req, res) => {
  Contact.delete(req.params.id, () => res.redirect('/contacts'));
};
