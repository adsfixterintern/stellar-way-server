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

export const EventBookingControllers = {
  createBooking,
};