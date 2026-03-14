"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadControllers = void 0;
const catchAsync_1 = __importDefault(require("../../app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const upload_service_1 = require("./upload.service");
const uploadSingleImage = (0, catchAsync_1.default)(async (req, res) => {
    const result = upload_service_1.UploadService.processSingleFile(req.file);
    if (!result) {
        throw new Error('No file selected!');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Image uploaded successfully!',
        data: result,
    });
});
const uploadMultipleImages = (0, catchAsync_1.default)(async (req, res) => {
    const result = upload_service_1.UploadService.processMultipleFiles(req.files);
    if (result.length === 0) {
        throw new Error('No files selected!');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Images uploaded successfully!',
        data: result,
    });
});
const deleteImage = (0, catchAsync_1.default)(async (req, res) => {
    const { publicId } = req.body;
    if (!publicId) {
        throw new Error('Public ID is required to delete image!');
    }
    await upload_service_1.UploadService.deleteImageFromCloudinary(publicId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Image deleted from Cloudinary successfully!',
        data: null,
    });
});
exports.UploadControllers = {
    uploadSingleImage,
    uploadMultipleImages,
    deleteImage,
};
