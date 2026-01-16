const fs = require("fs");
const Product = require("../models/models.products");

module.exports = async () => {
    const count = await Product.countDocuments();
    if (count) return;

    const data = fs.readFileSync(__dirname + "/../products.txt", "utf8");
    const products = data.split("\n").map(line => {
        const [name, price] = line.split(",");
        return { name, price };
    });

    await Product.insertMany(products);
    console.log("Products loaded");
};
