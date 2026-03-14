"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const catchAsync_1 = __importDefault(require("../../app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const message_service_1 = require("./message.service");
const createMessage = (0, catchAsync_1.default)(async (req, res) => {
    const result = await message_service_1.MessageService.sendMessageIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Message sent successfully',
        data: result,
    });
});
const getAllMessages = (0, catchAsync_1.default)(async (req, res) => {
    const result = await message_service_1.MessageService.getAllMessagesFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Messages fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
const deleteMessage = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    await message_service_1.MessageService.deleteMessageFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Message deleted successfully',
        data: null,
    });
});
exports.MessageController = {
    createMessage,
    getAllMessages,
    deleteMessage,
};
