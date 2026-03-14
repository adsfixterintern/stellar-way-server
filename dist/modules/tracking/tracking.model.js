"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracking = void 0;
const mongoose_1 = require("mongoose");
const trackingSchema = new mongoose_1.Schema({
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    riderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Rider',
        required: true
    },
    status: {
        type: String,
        enum: ['order-picked', 'on-the-way', 'near-location', 'delivered'],
        default: 'order-picked'
    },
    currentLocation: {
        lat: Number,
        lng: Number
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });
exports.Tracking = (0, mongoose_1.model)('Tracking', trackingSchema);
