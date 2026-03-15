"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../app/middlewares/auth.middleware");
const authorization_middleware_1 = require("../../app/middlewares/authorization.middleware");
const router = express_1.default.Router();
router.post("/register", user_controller_1.UserController.registerUser);
router.post("/login", user_controller_1.UserController.loginUser);
router.post("/logout", user_controller_1.UserController.logoutUser);
router.get("/admin-dashboard", auth_middleware_1.isAuthenticated, (0, authorization_middleware_1.authorizeRoles)("admin"), user_controller_1.UserController.getAdminData);
router.post('/forget-password', user_controller_1.UserController.forgetPassword);
router.patch('/reset-password/:token', user_controller_1.UserController.resetPassword);
router.patch('/change-password', auth_middleware_1.isAuthenticated, user_controller_1.UserController.changePassword);
exports.UserRoutes = router;
