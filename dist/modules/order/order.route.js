"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const router = express_1.default.Router();
router.post('/create-order', order_controller_1.OrderControllers.createOrder);
router.get('/', order_controller_1.OrderControllers.getAllOrders);
router.get('/:email', order_controller_1.OrderControllers.getMyOrders);
router.get('/details/:id', order_controller_1.OrderControllers.getOrderDetails);
router.patch('/status/:id', order_controller_1.OrderControllers.updatePaymentStatus);
router.patch('/delivery/:id', order_controller_1.OrderControllers.updateDeliveryStatus);
router.post('/create-stripe-order', order_controller_1.OrderControllers.createStripeOrder);
exports.OrderRoutes = router;
