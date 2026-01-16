const Order = require("../models/order");
const { getIO } = require("../config/socket");

exports.checkout = async (req, res) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    const success = Math.random() > 0.5;
    order.status = success ? "paid" : "failed";
    await order.save();

    getIO().emit("order_status_updated", {
        orderId: order._id,
        status: order.status
    });

    res.json({ status: order.status });
};
