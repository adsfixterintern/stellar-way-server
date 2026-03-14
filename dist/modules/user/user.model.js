"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rider = exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, select: false },
    role: { type: String, enum: ['admin', 'user', 'rider', 'chef'], default: 'user' },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
    image: { type: String }
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', userSchema);
const riderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, default: 5 },
    totalDeliveries: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive', 'terminated'], default: 'active' },
    vehicle: String
});
exports.Rider = (0, mongoose_1.model)('Rider', riderSchema);
