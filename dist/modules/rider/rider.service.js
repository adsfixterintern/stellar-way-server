"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderServices = void 0;
const user_model_1 = require("../user/user.model");
const createRiderIntoDB = async (payload) => {
    const user = await user_model_1.User.findById(payload.userId);
    if (!user)
        throw new Error('User not found!');
    await user_model_1.User.findByIdAndUpdate(payload.userId, { role: 'rider' });
    const newRider = await user_model_1.Rider.create(payload);
    return await newRider.populate('userId');
};
const getAllRidersFromDB = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const result = await user_model_1.Rider.find()
        .populate('userId')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    const total = await user_model_1.Rider.countDocuments();
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
const getSingleRiderFromDB = async (id) => {
    return await user_model_1.Rider.findById(id).populate('userId');
};
const updateRiderInDB = async (id, payload) => {
    return await user_model_1.Rider.findByIdAndUpdate(id, payload, { new: true });
};
const deleteRiderFromDB = async (id) => {
    return await user_model_1.Rider.findByIdAndDelete(id);
};
exports.RiderServices = {
    createRiderIntoDB,
    getAllRidersFromDB,
    getSingleRiderFromDB,
    updateRiderInDB,
    deleteRiderFromDB,
};
