"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChefServices = void 0;
const chef_model_1 = require("./chef.model");
const createChefIntoDB = async (payload) => {
    return await chef_model_1.Chef.create(payload);
};
const getAllChefsFromDB = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const result = await chef_model_1.Chef.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = await chef_model_1.Chef.countDocuments();
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
const getSingleChefFromDB = async (id) => {
    return await chef_model_1.Chef.findById(id);
};
const updateChefInDB = async (id, payload) => {
    return await chef_model_1.Chef.findByIdAndUpdate(id, payload, { new: true });
};
const deleteChefFromDB = async (id) => {
    return await chef_model_1.Chef.findByIdAndDelete(id);
};
exports.ChefServices = {
    createChefIntoDB,
    getAllChefsFromDB,
    getSingleChefFromDB,
    updateChefInDB,
    deleteChefFromDB,
};
