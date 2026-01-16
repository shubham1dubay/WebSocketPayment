const Order = require("../models/order");
const Product = require("../models/models.products");

exports.createOrder = async ({ userId, products }) => {
    let amount = 0;

    for (const p of products) {
        const product = await Product.findById(p.productId);
        amount += product.price * p.qty;
    }

    return Order.create({ userId, products, amount });
};

exports.getOrder = async (id) => {
    return Order.findById(id);
};
