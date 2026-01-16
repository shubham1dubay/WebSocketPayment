
const Product = require("../models/models.products");
const redis = require("../config/redis");

exports.getProducts = async () => {
    const cache = await redis.get("products");
    if (cache) return JSON.parse(cache);

    const products = await Product.find();
    await redis.setEx("products", 60, JSON.stringify(products));
    return products;
};
