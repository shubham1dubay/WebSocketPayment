const Order = require("../models/order");
const { getIO } = require("../config/socket");

exports.processPayment = async (orderId) => {
    const order = await Order.findById(orderId);

    const success = Math.random() > 0.5;
    order.status = success ? "paid" : "failed";
    await order.save();

    getIO().emit("order_status_updated", {
        orderId: order._id,
        status: order.status
    });

    return { status: order.status };
};
