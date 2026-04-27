import { IEventBooking } from "./eventBooking.interface";
import { EventBooking } from "./eventBooking.model";

const createBookingIntoDB = async (payload: Partial<IEventBooking>) => {
  const result = await EventBooking.create(payload);
  return result;
};

// admin get all booking
const getAllBookingsFromDB = async (query?: Record<string, any>) => {
  const { transactionId, paymentStatus, paymentMethod } = query || {};

  const filter: any = {};

  if (transactionId) {
    filter.transactionId = { $regex: transactionId, $options: "i" };
  }

  if (paymentStatus && paymentStatus !== "all") {
    filter.paymentStatus = paymentStatus;
  }

  if (paymentMethod && paymentMethod !== "all") {
    filter.paymentMethod = paymentMethod;
  }

  return await EventBooking.find(filter)
    .populate("userId", "name email")
    .populate("eventId")
    .sort({ createdAt: -1 });
};

// User Profile
const getMyBookingsFromDB = async (userId: string) => {
  return await EventBooking.find({ userId })
    .populate("eventId")
    .sort({ createdAt: -1 });
};

// single booking details
const getSingleBookingFromDB = async (id: string) => {
  return await EventBooking.findById(id).populate("eventId userId");
};

// admin dashboard analytics
const getBookingAnalyticsFromDB = async () => {
  const analytics = await EventBooking.aggregate([
    { $match: { paymentStatus: "paid" } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalTicketsSold: { $sum: "$numberOfSeats" },
        totalSuccessfulBookings: { $sum: 1 },
      },
    },
  ]);
  return analytics.length > 0
    ? analytics[0]
    : { totalRevenue: 0, totalTicketsSold: 0, totalSuccessfulBookings: 0 };
};

const deleteBookingFromDB = async (id: string) => {
  const booking = await EventBooking.findById(id);

  await EventBooking.findByIdAndDelete(id);

  return booking;
};

export const EventBookingServices = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getMyBookingsFromDB,
  getSingleBookingFromDB,
  getBookingAnalyticsFromDB,
  deleteBookingFromDB,
};
