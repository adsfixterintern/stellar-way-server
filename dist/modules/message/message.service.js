"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const message_model_1 = require("./message.model");
const sendMessageIntoDB = async (payload) => {
    const result = await message_model_1.Message.create(payload);
    return result;
};
const getAllMessagesFromDB = async (query) => {
    // Pagination logic
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;
    const result = await message_model_1.Message.find()
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);
    const total = await message_model_1.Message.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: result,
    };
};
const deleteMessageFromDB = async (id) => {
    const result = await message_model_1.Message.findByIdAndDelete(id);
    if (!result) {
        throw new Error('Message not found to delete!');
    }
    return result;
};
exports.MessageService = {
    sendMessageIntoDB,
    getAllMessagesFromDB,
    deleteMessageFromDB,
};
