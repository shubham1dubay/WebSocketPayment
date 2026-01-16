const mongoose = require('mongoose');
const Order = require("../models/order");
const Product = require("../models/models.products");

exports.createOrder = async (req, res) => {
    try {
        const { userId, products } = req.body;

        if (!userId || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Invalid payload. Provide userId and products array.' });
        }

        let amount = 0;
        const resolvedProducts = [];

        for (const p of products) {
            if (!p.productId) return res.status(400).json({ message: 'Each product must have a productId.' });
            if (!mongoose.isValidObjectId(p.productId)) return res.status(400).json({ message: `Invalid productId: ${p.productId}` });
            const qty = Number(p.qty) || 0;
            if (qty <= 0) return res.status(400).json({ message: 'Product qty must be >= 1.' });

            const product = await Product.findById(p.productId);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${p.productId}` });
            }

            amount += product.price * qty;
            resolvedProducts.push({ productId: product._id, qty });
        }

        const order = await Order.create({ userId, products: resolvedProducts, amount });
        return res.status(201).json(order);
    } catch (err) {
        console.error('createOrder error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        return res.json(order);
    } catch (err) {
        console.error('getOrder error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
