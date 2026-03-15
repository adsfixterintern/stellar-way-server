"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("../config/index"));
const user_model_1 = require("../../modules/user/user.model");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.isAuthenticated = (0, catchAsync_1.default)(async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Please login to access this resource',
        });
    }
    // token verify
    const decoded = jsonwebtoken_1.default.verify(token, index_1.default.jwt_secret);
    // user check
    const user = await user_model_1.User.findById(decoded.id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User no longer exists',
        });
    }
    if (user.status === 'blocked') {
        return res.status(403).json({
            success: false,
            message: 'Your account is blocked',
        });
    }
    // req te user set kora
    req.user = user;
    next();
});
