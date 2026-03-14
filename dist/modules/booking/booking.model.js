"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
// booking.model.ts
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: String,
    guest: Number,
    time: String,
    date: String
}, { timestamps: true });
exports.Booking = (0, mongoose_1.model)('Booking', bookingSchema, 'booking');
