"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("../config/index"));
const sendResponse_1 = __importDefault(require("./sendResponse"));
const sendToken = (user, statusCode, res) => {
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, index_1.default.jwt_secret, { expiresIn: '7d' });
    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
    };
    const userObj = user.toObject ? user.toObject() : { ...user };
    const { password, resetPasswordToken, resetPasswordExpires, createdAt, updatedAt, __v, ...cleanUser } = userObj;
    res.cookie("token", token, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode,
        success: true,
        message: statusCode === 201 ? "Registered Successfully" : "Logged in Successfully",
        data: {
            user: cleanUser,
            token,
        },
    });
};
exports.sendToken = sendToken;
