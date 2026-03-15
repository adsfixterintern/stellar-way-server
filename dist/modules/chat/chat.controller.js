"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const catchAsync_1 = __importDefault(require("../../app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const chat_service_1 = require("./chat.service");
const saveMessage = (0, catchAsync_1.default)(async (req, res) => {
    const result = await chat_service_1.ChatService.saveMessage(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Message saved successfully',
        data: result,
    });
});
const getOrderMessages = (0, catchAsync_1.default)(async (req, res) => {
    const { orderId } = req.params;
    const result = await chat_service_1.ChatService.getMessagesByOrder(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Chat history fetched successfully',
        data: result,
    });
});
exports.ChatController = {
    saveMessage,
    getOrderMessages
};
