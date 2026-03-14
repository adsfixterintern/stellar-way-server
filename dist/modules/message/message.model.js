"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    status: { type: String, enum: ['pending', 'replied'], default: 'pending' },
    date: { type: Date, default: Date.now }
});
exports.Message = (0, mongoose_1.model)('Message', messageSchema);
