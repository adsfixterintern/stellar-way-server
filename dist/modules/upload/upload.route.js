"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoutes = void 0;
const express_1 = __importDefault(require("express"));
const upload_controller_1 = require("./upload.controller");
const cloudinary_config_1 = require("../../app/config/cloudinary.config");
const router = express_1.default.Router();
router.post('/upload-single', cloudinary_config_1.upload.single('image'), upload_controller_1.UploadControllers.uploadSingleImage);
router.post('/upload-multiple', cloudinary_config_1.upload.array('images', 10), upload_controller_1.UploadControllers.uploadMultipleImages);
router.delete('/delete-image', upload_controller_1.UploadControllers.deleteImage);
exports.uploadRoutes = router;
