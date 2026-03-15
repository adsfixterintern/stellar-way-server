"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingController = void 0;
const catchAsync_1 = __importDefault(require("../../app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const tracking_service_1 = require("./tracking.service");
const updateLocation = (0, catchAsync_1.default)(async (req, res) => {
    const result = await tracking_service_1.TrackingService.updateLiveLocation(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Location updated successfully',
        data: result,
    });
});
const getTrackingDetails = (0, catchAsync_1.default)(async (req, res) => {
    const { orderId } = req.params;
    const result = await tracking_service_1.TrackingService.getOrderTrackingData(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Tracking details fetched successfully',
        data: result,
    });
});
exports.TrackingController = {
    updateLocation,
    getTrackingDetails
};
