"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: 'messages.senderModel'
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['User', 'Rider']
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    time: { type: Date, default: Date.now }
});
const chatSchema = new mongoose_1.Schema({
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        unique: true
    },
    messages: [messageSchema]
}, { timestamps: true });
exports.Chat = (0, mongoose_1.model)('Chat', chatSchema);
