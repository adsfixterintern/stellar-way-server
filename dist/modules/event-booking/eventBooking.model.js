"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBooking = void 0;
const mongoose_1 = require("mongoose");
const eventBookingSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    numberOfSeats: {
        type: Number,
        required: true,
        default: 1
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'cancelled'],
        default: 'pending'
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });
eventBookingSchema.index({ userId: 1, eventId: 1 });
exports.EventBooking = (0, mongoose_1.model)('EventBooking', eventBookingSchema);
