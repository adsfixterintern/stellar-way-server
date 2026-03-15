"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const mongoose_1 = require("mongoose");
const chat_model_1 = require("./chat.model");
const saveMessage = async (payload) => {
    const { orderId, sender, senderModel, message } = payload;
    const result = await chat_model_1.Chat.findOneAndUpdate({ orderId: new mongoose_1.Types.ObjectId(orderId) }, {
        $push: {
            messages: {
                sender: new mongoose_1.Types.ObjectId(sender),
                senderModel,
                message
            }
        }
    }, {
        new: true,
        upsert: true,
        runValidators: true
    });
    return result;
};
const getMessagesByOrder = async (orderId) => {
    const result = await chat_model_1.Chat.findOne({
        orderId: new mongoose_1.Types.ObjectId(orderId)
    }).populate('messages.sender');
    return result;
};
exports.ChatService = {
    saveMessage,
    getMessagesByOrder
};
