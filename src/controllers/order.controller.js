const Order = require("../models/order");
const Product = require("../models/models.products");

exports.createOrder = async (req, res) => {
    const { userId, products } = req.body;

    let amount = 0;
    for (const p of products) {
        const product = await Product.findById(p.productId);
        amount += product.price * p.qty;
    }

    const order = await Order.create({ userId, products, amount });
    res.json(order);
};

exports.getOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.json(order);
};
