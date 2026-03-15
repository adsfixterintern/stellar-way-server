import { IEventBooking } from './eventBooking.interface';
import { EventBooking } from './eventBooking.model';

const createBookingIntoDB = async (payload: Partial<IEventBooking>) => {
  const result = await EventBooking.create(payload);
  return result;
};

// admin get all booking
const getAllBookingsFromDB = async () => {
  return await EventBooking.find()
    .populate('userId', 'name email')
    .populate('eventId', 'title date')
    .sort({ createdAt: -1 });
};

// User Profile
const getMyBookingsFromDB = async (userId: string) => {
  return await EventBooking.find({ userId })
    .populate('eventId')
    .sort({ createdAt: -1 });
};

// single booking details
const getSingleBookingFromDB = async (id: string) => {
  return await EventBooking.findById(id).populate('eventId userId');
};

// admin dashboard analytics
const getBookingAnalyticsFromDB = async () => {
  const analytics = await EventBooking.aggregate([
    { $match: { paymentStatus: 'paid' } }, 
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' }, 
        totalTicketsSold: { $sum: '$numberOfSeats' }, 
        totalSuccessfulBookings: { $sum: 1 } 
      }
    }
  ]);
  return analytics.length > 0 ? analytics[0] : { totalRevenue: 0, totalTicketsSold: 0, totalSuccessfulBookings: 0 };
};

export const EventBookingServices = {
  createBookingIntoDB, 
  getAllBookingsFromDB,
  getMyBookingsFromDB,
  getSingleBookingFromDB,
  getBookingAnalyticsFromDB
};