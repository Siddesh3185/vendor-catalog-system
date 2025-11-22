const express = require("express");
const router = express.Router();
const controller = require("../controllers/vendorController");

router.get("/", controller.list);
router.get("/add", controller.renderAdd);
router.get("/edit/:id", controller.renderEdit);
router.post("/add", controller.add);
router.post("/update/:id", controller.update);
router.get("/delete/:id", controller.delete);

module.exports = router;
