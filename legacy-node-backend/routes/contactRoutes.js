const express = require('express');
const router = express.Router();
const controller = require('../controllers/contactController');

router.get('/', controller.list);
router.get('/add', controller.renderAdd);
router.post('/add', controller.add);
router.get('/edit/:id', controller.renderEdit);
router.post('/update/:id', controller.update);
router.get('/delete/:id', controller.delete);

module.exports = router;
