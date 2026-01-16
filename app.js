const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/products", require("./src/routes/product.router"));
app.use("/order", require("./src/routes/order.router"));
app.use("/payment", require("./src/routes/payment.router"));

module.exports = app;
