"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const gallery_controller_1 = require("./gallery.controller");
const cloudinary_config_1 = require("../../app/config/cloudinary.config");
const router = express_1.default.Router();
router.post('/', cloudinary_config_1.upload.single('image'), gallery_controller_1.GalleryControllers.createGalleryItem);
router.get('/', gallery_controller_1.GalleryControllers.getAllGalleryItems);
router.delete('/:id', gallery_controller_1.GalleryControllers.deleteGalleryItem);
exports.GalleryRoutes = router;
