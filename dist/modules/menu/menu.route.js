"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuRoutes = void 0;
const express_1 = __importDefault(require("express"));
const menu_controller_1 = require("./menu.controller");
const cloudinary_config_1 = require("../../app/config/cloudinary.config");
const router = express_1.default.Router();
router.post('/create-menu', cloudinary_config_1.upload.single('image'), menu_controller_1.MenuController.createMenu);
router.get('/', menu_controller_1.MenuController.getAllMenus);
router.get('/:id', menu_controller_1.MenuController.getSingleMenu);
router.patch('/:id', cloudinary_config_1.upload.single('image'), menu_controller_1.MenuController.updateMenu);
router.delete('/:id', menu_controller_1.MenuController.deleteMenu);
exports.MenuRoutes = router;
