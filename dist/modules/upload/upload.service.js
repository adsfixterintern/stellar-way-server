"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const cloudinary_config_1 = require("../../app/config/cloudinary.config");
const processSingleFile = (file) => {
    return file ? { url: file.path, public_id: file.filename } : null;
};
const processMultipleFiles = (files) => {
    if (!files)
        return [];
    return files.map((file) => ({
        url: file.path,
        public_id: file.filename,
    }));
};
const deleteImageFromCloudinary = async (publicId) => {
    const result = await cloudinary_config_1.cloudinaryInstance.uploader.destroy(publicId);
    if (result.result !== 'ok') {
        throw new Error('Image could not be deleted or already removed!');
    }
    return result;
};
exports.UploadService = {
    processSingleFile,
    processMultipleFiles,
    deleteImageFromCloudinary,
};
