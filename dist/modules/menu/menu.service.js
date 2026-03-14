"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const upload_service_1 = require("../upload/upload.service");
const menu_model_1 = require("./menu.model");
const createMenuIntoDB = async (payload) => {
    const result = await menu_model_1.Menu.create(payload);
    return result;
};
const getAllMenusFromDB = async (query) => {
    const { searchTerm, category, page, limit } = query;
    // Search Logic
    let searchTermQuery = {};
    if (searchTerm) {
        searchTermQuery = {
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { subTitle: { $regex: searchTerm, $options: 'i' } },
            ],
        };
    }
    // Filter by Category
    const filterQuery = category ? { categoryId: category } : {};
    // Pagination
    const currentPage = Number(page) || 1;
    const currentLimit = Number(limit) || 10;
    const skip = (currentPage - 1) * currentLimit;
    const result = await menu_model_1.Menu.find({ ...searchTermQuery, ...filterQuery })
        .populate('chefId')
        .populate('categoryId')
        .sort({ sortOrder: 1 })
        .skip(skip)
        .limit(currentLimit);
    const total = await menu_model_1.Menu.countDocuments({ ...searchTermQuery, ...filterQuery });
    return {
        meta: {
            page: currentPage,
            limit: currentLimit,
            total,
            totalPage: Math.ceil(total / currentLimit),
        },
        data: result,
    };
};
const getSingleMenuFromDB = async (id) => {
    const result = await menu_model_1.Menu.findById(id).populate('chefId').populate('categoryId');
    if (!result) {
        throw new Error('Menu item not found!');
    }
    return result;
};
const updateMenuInDB = async (id, payload) => {
    const result = await menu_model_1.Menu.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new Error('Menu item not found to update!');
    }
    return result;
};
const deleteMenuFromDB = async (id) => {
    const result = await menu_model_1.Menu.findByIdAndDelete(id);
    if (!result) {
        throw new Error('Menu item not found to delete!');
    }
    if (result.image?.publicId) {
        await upload_service_1.UploadService.deleteImageFromCloudinary(result.image.publicId);
    }
    return result;
};
exports.MenuService = {
    createMenuIntoDB,
    getAllMenusFromDB,
    getSingleMenuFromDB,
    updateMenuInDB,
    deleteMenuFromDB,
};
