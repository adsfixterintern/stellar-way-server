import { IBooking } from './booking.interface';
import { Booking } from './booking.model';
import { User } from '../user/user.model'; 

const createBookingIntoDB = async (payload: IBooking) => {
  const user = await User.findById(payload.userId);
  if (!user) throw new Error('User not found!');

  const bookingData = {
    ...payload,
    name: user.name,
    email: user.email,
    phone: user.phone,
  };

  const result = await Booking.create(bookingData);
  return result;
};


const getAllBookingsFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const result = await Booking.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Booking.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: result,
  };
};


const getSingleBookingFromDB = async (id: string) => {
  const result = await Booking.findById(id);
  return result;
};


const updateBookingInDB = async (id: string, payload: Partial<IBooking>) => {
  const result = await Booking.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};


const deleteBookingFromDB = async (id: string) => {
  const result = await Booking.findByIdAndDelete(id);
  return result;
};


const getMyBookingsFromDB = async (userId: string) => {
  // ডাটাবেস থেকে শুধু ওই ইউজারের ডাটা ফিল্টার করে আনা
  const result = await Booking.find({ userId }).sort({ createdAt: -1 });
  return result;
};

export const BookingServices = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getSingleBookingFromDB,
  updateBookingInDB,
  deleteBookingFromDB,
  getMyBookingsFromDB
};