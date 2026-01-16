const mongoose = require("mongoose");

module.exports = mongoose.model(
    "Order",
    new mongoose.Schema({
        userId: String,
        products: [{
            productId: mongoose.Schema.Types.ObjectId,
            qty: Number
        }],
        amount: Number,
        status: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        }
    }, { timestamps: true })
);
