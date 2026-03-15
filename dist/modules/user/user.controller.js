"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const jwtToken_1 = require("../../app/utils/jwtToken");
const catchAsync_1 = __importDefault(require("../../app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
// Register
const registerUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserService.registerUserIntoDB(req.body);
    (0, jwtToken_1.sendToken)(result, 201, res);
});
// Login
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserService.loginUserFromDB(req.body);
    (0, jwtToken_1.sendToken)(result, 200, res);
});
// Logout
const logoutUser = (0, catchAsync_1.default)(async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Logged out successfully",
        data: null,
    });
});
const forgetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const { email } = req.body;
    await user_service_1.UserService.forgetPasswordIntoDB(email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Reset link sent to your email!",
        data: null,
    });
});
const resetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    await user_service_1.UserService.resetPasswordIntoDB(token, password);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Password reset successful!",
        data: null,
    });
});
const changePassword = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?._id;
    await user_service_1.UserService.changePasswordIntoDB(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Password changed successfully!",
        data: null,
    });
});
const getAdminData = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Welcome to the Admin Dashboard!",
        data: {
            adminInfo: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            secretStats: {
                totalUsers: 150,
                revenue: "$5000",
                message: "This data is only visible to Admins.",
            },
        },
    });
});
exports.UserController = {
    registerUser,
    loginUser,
    logoutUser,
    getAdminData,
    forgetPassword,
    resetPassword,
    changePassword,
};
