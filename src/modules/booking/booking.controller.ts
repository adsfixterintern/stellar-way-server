// import { Request, Response } from 'express';
// import sendResponse from '../../app/utils/sendResponse';
// import catchAsync from '../../app/utils/catchAsync';
// import { BookingServices } from './booking.service';

// const getMyBookings = catchAsync(async (req: Request, res: Response) => {
//   const { userId } = req.body;

//   if (!userId) {
//     return sendResponse(res, {
//       statusCode: 400,
//       success: false,
//       message: 'User ID is required in request body',
//       data: null,
//     });
//   }

//   const result = await BookingServices.getMyBookingsFromDB(userId);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'My bookings retrieved successfully',
//     data: result,
//   });
// });

// const createBooking = catchAsync(async (req: Request, res: Response) => {

//   const result = await BookingServices.createBookingIntoDB(req.body);
//   // console.log(result);

//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: 'Table(s) reserved successfully!',
//     data: result,
//   });
// });

// const checkAvailability = catchAsync(async (req: Request, res: Response) => {
//   const { date, startTime, endTime } = req.query;

//   const result = await BookingServices.getAvailableTablesFromDB(
//     date as string,
//     startTime as string,
//     endTime as string
//   );

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Fetched successfully",
//     data: result,
//   });
// });

// const getAllBookings = catchAsync(async (req: Request, res: Response) => {
//   const result = await BookingServices.getAllBookingsFromDB(req.query);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Bookings retrieved successfully',
//     data: result.data,
//     meta: result.meta,
//   });
// });

// const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const result = await BookingServices.getSingleBookingFromDB(id as string);

//   if (!result) {
//     sendResponse(res, {
//       statusCode: 404,
//       success: false,
//       message: 'No booking found with this ID',
//       data: null,
//     });
//     return;
//   }

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Booking retrieved successfully',
//     data: result,
//   });
// });

// const updateBooking = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const result = await BookingServices.updateBookingInDB(id as string, req.body);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Booking updated successfully',
//     data: result,
//   });
// });

// const deleteBooking = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   await BookingServices.deleteBookingFromDB(id as string);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Booking deleted successfully',
//     data: null,
//   });
// });

// export const BookingControllers = {
//   createBooking,
//   getAllBookings,
//   getSingleBooking,
//   updateBooking,
//   deleteBooking,
//   getMyBookings,
//   checkAvailability,
// };

import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { BookingServices } from "./booking.service";
import { User } from "../user/user.model";
import { Booking } from "./booking.model";
import config from "../../app/config";
import QRCode from "qrcode";
import {
  initiateSSLPayment,
  initiateStripePayment,
} from "../../app/utils/payment.utils";

// --- SSLCommerz Booking ---
const createSSLBooking = catchAsync(async (req: Request, res: Response) => {
  const {
    userId,
    tableIds,
    date,
    startTime,
    endTime,
    totalPrice,
    guest,
    address,
  } = req.body;
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found!");

  const transactionId = `TXN-SSL-${Date.now()}`;
  const bookingData = {
    ...req.body,
    name: user.name,
    email: user.email,
    phone: user.phone,
    transactionId,
    paymentMethod: "SSLCommerz",
    paymentStatus: "pending",
  };

  const result = await BookingServices.createBookingIntoDB(bookingData);
  const paymentUrl = await initiateSSLPayment(
    {
      totalPrice,
      transactionId,
      productName: "Table Reservation",
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,
    },
    "bookings",
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "SSL Payment Initiated",
    data: { booking: result, paymentUrl },
  });
});

// --- Stripe Booking ---
const createStripeBooking = catchAsync(async (req: Request, res: Response) => {
  const { userId, totalPrice } = req.body;
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found!");

  const transactionId = `TXN-STP-${Date.now()}`;
  const bookingData = {
    ...req.body,
    name: user.name,
    email: user.email,
    phone: user.phone,
    transactionId,
    paymentMethod: "Stripe",
    paymentStatus: "pending",
  };

  const result = await BookingServices.createBookingIntoDB(bookingData);
  const paymentUrl = await initiateStripePayment(
    {
      totalPrice,
      transactionId,
      productName: "Table Reservation",
      customerEmail: user.email,
    },
    "bookings",
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Stripe Payment Initiated",
    data: { booking: result, paymentUrl },
  });
});

// --- Confirm Payment (Common for both) ---

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;
  const status = (req.query.status as string)?.toLowerCase();

  if (!transactionId) {
    throw new Error("Transaction ID is required!");
  }

  let redirectPath = "/reservation/fail";

  const booking = await Booking.findOne({ transactionId });

  if (!booking) {
    throw new Error("Booking not found!");
  }

  // ✅ SUCCESS CASE
  if (["success", "valid", "validated"].includes(status)) {
    if (booking.paymentStatus !== "paid") {
      const qrPayload = JSON.stringify({
        customer: booking.name,
        transaction: transactionId,
        date: booking.date,
        time: `${booking.startTime} - ${booking.endTime}`,
        totalPrice: booking.totalPrice,
      });

      try {
        const qrCodeBase64 = await QRCode.toDataURL(qrPayload);

        await Booking.findOneAndUpdate(
          { transactionId },
          {
            paymentStatus: "paid",
            qrCode: qrCodeBase64,
          },
        );
      } catch (err) { 
        await Booking.findOneAndUpdate(
          { transactionId },
          { paymentStatus: "paid" },
        );
      }
    }

    redirectPath = `/reservation/success/${transactionId}`;
  }

  // ❌ CANCEL / FAIL
  else {
    await Booking.findOneAndUpdate(
      { transactionId },
      { paymentStatus: "cancelled" },
    );

    redirectPath = status === "cancel" ? "/reservation/cancel" : "/reservation/fail";
  }

  res.redirect(`${config.clientUrl}${redirectPath}`);
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await BookingServices.getMyBookingsFromDB(userId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My bookings fetched",
    data: result,
  });
});

const checkAvailability = catchAsync(async (req: Request, res: Response) => {
  const { date, startTime, endTime } = req.query;
  const result = await BookingServices.getAvailableTablesFromDB(
    date as string,
    startTime as string,
    endTime as string,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Availability checked",
    data: result,
  });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.getAllBookingsFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All bookings fetched",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.getSingleBookingFromDB(
    req.params.id as string,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking fetched",
    data: result,
  });
});

const updateBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.updateBookingInDB(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking updated",
    data: result,
  });
});

const deleteBooking = catchAsync(async (req: Request, res: Response) => {
  await BookingServices.deleteBookingFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking deleted",
    data: null,
  });
});

export const BookingControllers = {
  createSSLBooking,
  createStripeBooking,
  confirmPayment,
  getAllBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
  getMyBookings,
  checkAvailability,
};
