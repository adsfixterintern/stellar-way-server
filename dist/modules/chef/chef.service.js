"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChefServices = void 0;
const chef_model_1 = require("./chef.model");
const createChefIntoDB = async (payload) => {
    return await chef_model_1.Chef.create(payload);
};
const getAllChefsFromDB = async () => {
    return await chef_model_1.Chef.find();
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
