"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingServices = void 0;
const booking_model_1 = require("./booking.model");
const user_model_1 = require("../user/user.model");
const createBookingIntoDB = async (payload) => {
    const user = await user_model_1.User.findById(payload.userId);
    if (!user)
        throw new Error('User not found!');
    const bookingData = {
        ...payload,
        name: user.name,
        email: user.email,
        phone: user.phone,
    };
    const result = await booking_model_1.Booking.create(bookingData);
    return result;
};
const getAllBookingsFromDB = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const result = await booking_model_1.Booking.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = await booking_model_1.Booking.countDocuments();
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
const getSingleBookingFromDB = async (id) => {
    const result = await booking_model_1.Booking.findById(id);
    return result;
};
const updateBookingInDB = async (id, payload) => {
    const result = await booking_model_1.Booking.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
const deleteBookingFromDB = async (id) => {
    const result = await booking_model_1.Booking.findByIdAndDelete(id);
    return result;
};
exports.BookingServices = {
    createBookingIntoDB,
    getAllBookingsFromDB,
    getSingleBookingFromDB,
    updateBookingInDB,
    deleteBookingFromDB,
};
