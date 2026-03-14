"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingControllers = void 0;
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../app/utils/catchAsync"));
const booking_service_1 = require("./booking.service");
const createBooking = (0, catchAsync_1.default)(async (req, res) => {
    const result = await booking_service_1.BookingServices.createBookingIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Booking created successfully',
        data: result,
    });
});
const getAllBookings = (0, catchAsync_1.default)(async (req, res) => {
    const result = await booking_service_1.BookingServices.getAllBookingsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All bookings retrieved successfully',
        data: result,
    });
});
const getSingleBooking = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await booking_service_1.BookingServices.getSingleBookingFromDB(id);
    if (!result) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: 'No booking found with this ID',
            data: null,
        });
        return;
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Booking retrieved successfully',
        data: result,
    });
});
const updateBooking = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await booking_service_1.BookingServices.updateBookingInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Booking updated successfully',
        data: result,
    });
});
const deleteBooking = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    await booking_service_1.BookingServices.deleteBookingFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Booking deleted successfully',
        data: null,
    });
});
exports.BookingControllers = {
    createBooking,
    getAllBookings,
    getSingleBooking,
    updateBooking,
    deleteBooking,
};
