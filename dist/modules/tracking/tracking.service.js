"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingService = void 0;
const tracking_model_1 = require("./tracking.model");
const updateLiveLocation = async (payload) => {
    const { orderId, currentLocation, status, riderId } = payload;
    const result = await tracking_model_1.Tracking.findOneAndUpdate({ orderId }, {
        $set: {
            currentLocation,
            status,
            riderId,
            updatedAt: new Date()
        }
    }, { upsert: true, new: true });
    return result;
};
const getOrderTrackingData = async (orderId) => {
    const result = await tracking_model_1.Tracking.findOne({ orderId })
        .populate('orderId')
        .populate('riderId');
    if (!result) {
        throw new Error('Tracking information not found for this order!');
    }
    return result;
};
exports.TrackingService = {
    updateLiveLocation,
    getOrderTrackingData
};
