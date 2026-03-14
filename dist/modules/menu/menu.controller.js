"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuController = void 0;
const catchAsync_1 = __importDefault(require("../../app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const menu_service_1 = require("./menu.service");
const upload_service_1 = require("../upload/upload.service");
const createMenu = (0, catchAsync_1.default)(async (req, res) => {
    if (req.file) {
        const uploadResult = upload_service_1.UploadService.processSingleFile(req.file);
        if (uploadResult) {
            req.body.image = uploadResult;
        }
    }
    const result = await menu_service_1.MenuService.createMenuIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Menu created successfully',
        data: result,
    });
});
const getAllMenus = (0, catchAsync_1.default)(async (req, res) => {
    const result = await menu_service_1.MenuService.getAllMenusFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Menus fetched successfully',
        data: result.data,
        meta: result.meta,
    });
});
const getSingleMenu = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await menu_service_1.MenuService.getSingleMenuFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Menu details fetched successfully',
        data: result,
    });
});
const updateMenu = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    if (req.file) {
        const uploadResult = upload_service_1.UploadService.processSingleFile(req.file);
        if (uploadResult)
            req.body.image = uploadResult;
    }
    const result = await menu_service_1.MenuService.updateMenuInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Menu updated successfully',
        data: result,
    });
});
const deleteMenu = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    await menu_service_1.MenuService.deleteMenuFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Menu deleted successfully',
        data: null,
    });
});
exports.MenuController = {
    createMenu,
    getAllMenus,
    getSingleMenu,
    updateMenu,
    deleteMenu,
};
