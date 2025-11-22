const express = require("express");
const app = express();
const bodyParser = require("body-parser");

require("dotenv").config();
require("./config/db");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/vendors", require("./routes/vendorRoutes"));
app.use("/products", require("./routes/productRoutes"));
app.use("/contacts", require("./routes/contactRoutes"));

app.get("/", (req, res) => {
    res.render("dashboard");
});

app.listen(3000, () => console.log("Server running on port 3000"));
