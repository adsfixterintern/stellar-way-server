"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderControllers = void 0;
const catchAsync_1 = __importDefault(require("../../app/utils/catchAsync"));
const rider_service_1 = require("./rider.service");
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
// const createRider = catchAsync(async (req: Request, res: Response) => {
//   const result = await RiderServices.createRiderIntoDB(req.body);
//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: "Rider created successfully",
//     data: result,
//   });
// });
const createRider = (0, catchAsync_1.default)(async (req, res) => {
    const result = await rider_service_1.RiderServices.createRiderIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Rider created successfully",
        data: result,
    });
});
const getAllRiders = (0, catchAsync_1.default)(async (req, res) => {
    const result = await rider_service_1.RiderServices.getAllRidersFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Riders retrieved successfully",
        data: result,
    });
});
const getSingleRider = (0, catchAsync_1.default)(async (req, res) => {
    const result = await rider_service_1.RiderServices.getSingleRiderFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Rider retrieved successfully",
        data: result,
    });
});
const updateRider = (0, catchAsync_1.default)(async (req, res) => {
    const result = await rider_service_1.RiderServices.updateRiderInDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Rider updated successfully",
        data: result,
    });
});
const deleteRider = (0, catchAsync_1.default)(async (req, res) => {
    await rider_service_1.RiderServices.deleteRiderFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Rider deleted successfully",
        data: null,
    });
});
exports.RiderControllers = {
    createRider,
    getAllRiders,
    getSingleRider,
    updateRider,
    deleteRider,
};
