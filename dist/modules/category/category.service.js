"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const category_model_1 = require("./category.model");
const createCategoryIntoDB = async (payload) => {
    const result = await category_model_1.Category.create(payload);
    return result;
};
const getAllCategoriesFromDB = async () => {
    const result = await category_model_1.Category.find().sort({ sortOrder: 1 });
    return result;
};
const updateCategoryInDB = async (id, payload) => {
    const result = await category_model_1.Category.findByIdAndUpdate(id, payload, { new: true });
    return result;
};
const deleteCategoryFromDB = async (id) => {
    const result = await category_model_1.Category.findByIdAndDelete(id);
    return result;
};
exports.CategoryService = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
    updateCategoryInDB,
    deleteCategoryFromDB,
};
