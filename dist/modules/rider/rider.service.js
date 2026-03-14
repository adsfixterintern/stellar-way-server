"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderServices = void 0;
const user_model_1 = require("../user/user.model");
// const createRiderIntoDB = async (payload: IRider) => {
//   const isUserExists = await User.findById(payload.userId);
//   if (!isUserExists) throw new Error('User not found!');
//   return await Rider.create(payload);
// };
const createRiderIntoDB = async (payload) => {
    // ১. ইউজার চেক করা
    const user = await user_model_1.User.findById(payload.userId);
    if (!user)
        throw new Error('User not found!');
    // ২. ইউজারের রোল 'rider' এ আপডেট করা
    await user_model_1.User.findByIdAndUpdate(payload.userId, { role: 'rider' });
    // ৩. রাইডার তৈরি করা (ইউজারের তথ্যসহ যদি মডেলে ফিল্ড থাকে)
    // যদি রাইডার মডেলে name, email, phone ফিল্ড থাকে, তবে এভাবে ডাটা মার্জ করুন:
    const riderData = {
        ...payload,
        // প্রয়োজনে এখানে user.name, user.email যোগ করুন
    };
    return await user_model_1.Rider.create(riderData);
};
// ...বাকি ফাংশনগুলো আগের মতোই থাকবে
const getAllRidersFromDB = async () => {
    return await user_model_1.Rider.find().populate('userId');
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
