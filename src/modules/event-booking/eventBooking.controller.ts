import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { EventBookingServices } from './eventBooking.service';
import { initiateSSLPayment } from '../../app/utils/payment.utils';
import { Event } from '../event/event.model';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const { eventId, numberOfSeats, userName, userEmail, phone } = req.body;
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error('Event not found!');
  }

  if (event.seat < numberOfSeats) {
    throw new Error('Not enough seats available!');
  }
  const transactionId = `TXN-EVT-${Date.now()}`;
  const totalAmount = event.price * numberOfSeats;

  const bookingData = {
    ...req.body,
    totalAmount,
    transactionId,
    paymentStatus: 'pending',
  };
  const result = await EventBookingServices.createBookingIntoDB(bookingData);
  const paymentUrl = await initiateSSLPayment({
    totalPrice: totalAmount,
    transactionId,
    productName: event.title,
    customerName: userName,
    customerEmail: userEmail,
    customerPhone: phone,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Booking initiated, redirecting to payment gateway...',
    data: { 
      booking: result, 
      paymentUrl 
    },
  });
});

// all booking get admin
const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await EventBookingServices.getAllBookingsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All bookings fetched successfully',
    data: result,
  });
});

//user info
const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params; // অথবা auth middleware থেকে req.user.id
  const result = await EventBookingServices.getMyBookingsFromDB(userId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My bookings fetched successfully',
    data: result,
  });
});

// single booking details
const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await EventBookingServices.getSingleBookingFromDB(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking details fetched',
    data: result,
  });
});

// admin dashboard (Revenue & Stats)
const getBookingAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await EventBookingServices.getBookingAnalyticsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking analytics fetched successfully!',
    data: result,
  });
});

export const EventBookingControllers = {
  createBooking, 
  getAllBookings,
  getMyBookings,
  getSingleBooking,
  getBookingAnalytics,
};