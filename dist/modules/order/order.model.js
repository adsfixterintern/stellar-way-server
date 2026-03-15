"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    customerInfo: {
        user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
    },
    items: [
        {
            menuId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Menu", required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    totalPrice: { type: Number, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    paymentStatus: {
        type: String,
        enum: ["unpaid", "paid", "failed", "cancelled"],
        default: "unpaid",
    },
    deliveryStatus: {
        type: String,
        enum: ["pending", "confirmed", "cooking", "on-the-way", "delivered"],
        default: "pending",
    },
    transactionId: { type: String, required: true },
    paymentMethod: { type: String, default: "SSLCommerz" },
    date: { type: Date, default: Date.now },
}, { timestamps: true });
exports.Order = (0, mongoose_1.model)('Order', orderSchema);
