import { Request, Response } from "express";
import httpStatus from "http-status";
import { Types } from "mongoose";
import { EventBooking } from "./eventBooking.model";
import config from "../../app/config";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { EventBookingServices } from "./eventBooking.service";
import { Event } from "../event/event.model";
import QRCode from "qrcode";
import {
  initiateSSLPayment,
  initiateStripePayment,
} from "../../app/utils/payment.utils";
import { IEventBooking } from "./eventBooking.interface";

const createSSLBooking = catchAsync(async (req: Request, res: Response) => {
  const {
    eventId,
    numberOfSeats,
    userName,
    userEmail,
    phone,
    userId,
    date,
    time,
  } = req.body;

  console.log("1. Incoming Payload:", req.body);

  if (!eventId || !userId || !date || !time) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Required fields missing (eventId, userId, date, or time)!",
      data: null,
    });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found in Database!");

    if (event.availableSeat < (Number(numberOfSeats) || 1)) {
      throw new Error("Sorry, not enough seats available!");
    }

    const transactionId = `TXN-EVT-${Date.now()}`;
    const totalAmount = event.price * (Number(numberOfSeats) || 1);

    // ৩. ডাটাবেজ ডাটা প্রস্তুত করা
    const bookingData: Partial<IEventBooking> = {
      userId: new Types.ObjectId(userId),
      eventId: new Types.ObjectId(eventId),
      numberOfSeats: Number(numberOfSeats) || 1,
      selectedDate: date,
      selectedTime: time,
      phone: phone || "017XXXXXXXX",
      totalAmount: totalAmount,
      transactionId,
      paymentMethod: "SSLCommerz",
      paymentStatus: "pending",
    };

    console.log("2. Saving to Database...");
    const result = await EventBookingServices.createBookingIntoDB(bookingData);
    console.log("3. Database Save Success!");

    try {
      console.log("4. Calling SSLCommerz Gateway...");
      const paymentUrl = await initiateSSLPayment({
        totalPrice: totalAmount,
        transactionId,
        productName: event.title,
        customerName: userName || "Guest",
        customerEmail: userEmail || "guest@example.com",
        customerPhone: phone || "01700000000",
      },'event-bookings');

      console.log("5. SSLCommerz URL Generated:", paymentUrl);

      if (!paymentUrl) {
        throw new Error("SSLCommerz returned an empty URL!");
      }

      sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "SSLCommerz booking initiated successfully.",
        data: { booking: result, paymentUrl },
      });
    } catch (paymentError: any) {
      console.error("--- SSLCommerz Gateway Error ---");
      console.error(paymentError);
      return sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: `Payment Gateway Error: ${paymentError.message}`,
        data: null,
      });
    }
  } catch (error: any) {
    console.error("--- General Booking Error ---");
    console.error(error.message);
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || "Internal Server Error during booking",
      data: null,
    });
  }
});
// --- ২. Stripe Booking Controller ---
const createStripeBooking = catchAsync(async (req: Request, res: Response) => {
  const {
    eventId,
    numberOfSeats,
    userName,
    userEmail,
    phone,
    userId,
    date,
    time,
  } = req.body;

  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found!");
  if (event.availableSeat < (Number(numberOfSeats) || 1)) {
    throw new Error("Sorry, not enough seats available!");
  }

  const transactionId = `STXP-EVT-${Date.now()}`;
  const totalAmount = event.price * numberOfSeats;

  const bookingData = {
    userId,
    eventId,
    numberOfSeats,
    selectedDate: date,
    selectedTime: time,
    phone,
    totalAmount,
    transactionId,
    paymentMethod: "Stripe" as const,
    paymentStatus: "pending" as const,
  };

  const result = await EventBookingServices.createBookingIntoDB(bookingData);

  const paymentUrl = await initiateStripePayment({
    totalPrice: totalAmount,
    transactionId,
    productName: event.title,
    customerEmail: userEmail,
  },'event-bookings');

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Stripe booking initiated...",
    data: { booking: result, paymentUrl },
  });
});

// --- অন্যান্য কন্ট্রোলার ---
const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await EventBookingServices.getAllBookingsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All bookings fetched successfully",
    data: result,
  });
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await EventBookingServices.getMyBookingsFromDB(
    userId as string,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My bookings fetched successfully",
    data: result,
  });
});

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await EventBookingServices.getSingleBookingFromDB(
    id as string,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking details fetched",
    data: result,
  });
});

const getBookingAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await EventBookingServices.getBookingAnalyticsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking analytics fetched successfully!",
    data: result,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;
  const status = req.query.status as string;

  if (!transactionId) {
    throw new Error("Transaction ID is required!");
  }

  let updateStatus: "pending" | "paid" | "cancelled" = "pending";
  let redirectPath = "/event/fail";

  if (status === "success") {
    // ১. বুকিং খুঁজে বের করা এবং Event ও User ডাটা পপুলেট করা (QR Code-এ নাম দেখানোর জন্য)
    const booking = await EventBooking.findOne({ transactionId }).populate(
      "eventId userId",
    );

    if (!booking) {
      throw new Error("Booking not found!");
    }

    // ২. ডাবল সিট কাটা রোধ করতে চেক (Idempotency check)
    if (booking.paymentStatus !== "paid") {
      const event: any = booking.userId; // Populate করার কারণে এটি এখন অবজেক্ট
      const user: any = booking.userId;
      const eventDetails: any = booking.eventId;

      // ৩. QR Code এর জন্য ডাটা অবজেক্ট তৈরি
      const qrPayload = JSON.stringify({
        customer: user?.name || "Guest",
        event: eventDetails?.title || "Event",
        transaction: transactionId,
        seats: booking.numberOfSeats,
        time: booking.selectedTime,
        date: booking.selectedDate,
      });

      const qrCodeBase64 = await QRCode.toDataURL(qrPayload, {
        color: {
          dark: "#1A4E11",
          light: "#FFFFFF",
        },
        margin: 2,
      });

      await Promise.all([
        Event.findByIdAndUpdate(booking.eventId, {
          $inc: { availableSeat: -booking.numberOfSeats },
        }),
        EventBooking.findOneAndUpdate(
          { transactionId },
          {
            paymentStatus: "paid",
            qrCode: qrCodeBase64,
          },
        ),
      ]);

      updateStatus = "paid";
    }

    redirectPath = `/event/success/${transactionId}`;
  } else if (status === "cancel") {
    updateStatus = "cancelled";
    redirectPath = "/event/fail";
  } else {
    await EventBooking.findOneAndUpdate(
      { transactionId },
      { paymentStatus: "cancelled" },
    );
  }
  res.redirect(`${config.clientUrl}${redirectPath}`);
});

const deleteBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await EventBookingServices.deleteBookingFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking deleted successfully",
    data: result,
  });
});
export const EventBookingControllers = {
  createSSLBooking,
  confirmPayment,
  createStripeBooking,
  getAllBookings,
  getMyBookings,
  getSingleBooking,
  getBookingAnalytics,
  deleteBooking
};
