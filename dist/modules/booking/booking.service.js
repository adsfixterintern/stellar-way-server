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
// ২. সব বুকিং দেখা (এখন পপুলেশন লাগবে না, ডাটা অলরেডি বুকিং কালেকশনেই আছে)
const getAllBookingsFromDB = async () => {
    const result = await booking_model_1.Booking.find();
    return result;
};
// ৩. একটি নির্দিষ্ট বুকিং দেখা
const getSingleBookingFromDB = async (id) => {
    const result = await booking_model_1.Booking.findById(id);
    return result;
};
// ৪. আপডেট করা
const updateBookingInDB = async (id, payload) => {
    const result = await booking_model_1.Booking.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
// ৫. ডিলিট করা
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
