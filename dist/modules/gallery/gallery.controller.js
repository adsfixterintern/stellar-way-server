"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryControllers = void 0;
const catchAsync_1 = __importDefault(require("../../app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const gallery_model_1 = require("./gallery.model");
const upload_service_1 = require("../upload/upload.service");
const createGalleryItem = (0, catchAsync_1.default)(async (req, res) => {
    const { categoryId, sortOrder } = req.body;
    const fileData = upload_service_1.UploadService.processSingleFile(req.file);
    if (!fileData) {
        throw new Error('Image file is required!');
    }
    const result = await gallery_model_1.Gallery.create({
        image: fileData.url,
        categoryId,
        sortOrder: sortOrder || 0,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Gallery item created successfully!',
        data: result,
    });
});
const getAllGalleryItems = (0, catchAsync_1.default)(async (req, res) => {
    const result = await gallery_model_1.Gallery.find()
        .populate('categoryId')
        .sort({ sortOrder: 1, createdAt: -1 });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Gallery items fetched successfully!',
        data: result,
    });
});
// ৩. গ্যালারি আইটেম ডিলিট করা
const deleteGalleryItem = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const item = await gallery_model_1.Gallery.findById(id);
    if (!item) {
        throw new Error('Item not found!');
    }
    const publicId = item.image.split('/').pop()?.split('.')[0] || '';
    if (publicId) {
        await upload_service_1.UploadService.deleteImageFromCloudinary(publicId);
    }
    await gallery_model_1.Gallery.findByIdAndDelete(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Gallery item deleted successfully!',
        data: null,
    });
});
exports.GalleryControllers = {
    createGalleryItem,
    getAllGalleryItems, // এখন এটি স্কোপে আছে
    deleteGalleryItem,
};
