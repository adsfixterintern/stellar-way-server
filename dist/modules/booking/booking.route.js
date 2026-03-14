"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("./booking.controller");
const router = express_1.default.Router();
router.post('/create-booking', booking_controller_1.BookingControllers.createBooking);
router.get('/', booking_controller_1.BookingControllers.getAllBookings);
router.get('/:id', booking_controller_1.BookingControllers.getSingleBooking);
router.patch('/:id', booking_controller_1.BookingControllers.updateBooking);
router.delete('/:id', booking_controller_1.BookingControllers.deleteBooking);
exports.BookingRoutes = router;
