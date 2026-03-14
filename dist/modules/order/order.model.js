"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    customerInfo: {
        user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        email: String
    },
    deliveryStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'cooking', 'on-the-way', 'delivered'],
        default: 'pending'
    },
    riderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Rider' },
    totalPrice: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });
exports.Order = (0, mongoose_1.model)('Order', orderSchema);
