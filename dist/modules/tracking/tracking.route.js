"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const tracking_controller_1 = require("./tracking.controller");
const router = express_1.default.Router();
router.patch('/update', tracking_controller_1.TrackingController.updateLocation);
router.get('/:orderId', tracking_controller_1.TrackingController.getTrackingDetails);
exports.TrackingRoutes = router;
