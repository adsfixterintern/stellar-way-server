"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChefControllers = void 0;
const catchAsync_1 = __importDefault(require("../../app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const chef_service_1 = require("./chef.service");
const createChef = (0, catchAsync_1.default)(async (req, res) => {
    const result = await chef_service_1.ChefServices.createChefIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Chef created successfully",
        data: result,
    });
});
const getAllChefs = (0, catchAsync_1.default)(async (req, res) => {
    const result = await chef_service_1.ChefServices.getAllChefsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Chefs retrieved successfully",
        data: result,
    });
});
const getSingleChef = (0, catchAsync_1.default)(async (req, res) => {
    const result = await chef_service_1.ChefServices.getSingleChefFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Chef retrieved successfully",
        data: result,
    });
});
const updateChef = (0, catchAsync_1.default)(async (req, res) => {
    const result = await chef_service_1.ChefServices.updateChefInDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Chef updated successfully",
        data: result,
    });
});
const deleteChef = (0, catchAsync_1.default)(async (req, res) => {
    await chef_service_1.ChefServices.deleteChefFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Chef deleted successfully",
        data: null,
    });
});
exports.ChefControllers = {
    createChef,
    getAllChefs,
    getSingleChef,
    updateChef,
    deleteChef,
};
