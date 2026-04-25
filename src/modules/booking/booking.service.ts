import { IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { User } from "../user/user.model";

const createBookingIntoDB = async (payload: IBooking) => {
  const user = await User.findById(payload.userId);
  if (!user) throw new Error("User not found!");

  const existingBookings = await Booking.find({
    date: payload.date,
    tableIds: { $in: payload.tableIds },
    $and: [
      { startTime: { $lt: payload.endTime } },
      { endTime: { $gt: payload.startTime } },
    ],
  });

  if (existingBookings.length > 0) {
    throw new Error(
      "One or more selected tables are already booked for this time slot!",
    );
  }

  const bookingData = {
    ...payload,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: payload.address || "Not Specified",
  };

  const result = await Booking.create(bookingData);

  return result;
};

const getAvailableTablesFromDB = async (date: string, startTime: string, endTime: string) => {
 
  if (!date || !startTime || !endTime) return [];

 
  const bookedBookings = await Booking.find({
    date: date,
    $and: [
      { startTime: { $lt: endTime } }, 
      { endTime: { $gt: startTime } }  
    ]
  }).select('tableIds');

 
  if (!bookedBookings || bookedBookings.length === 0) {
    return [];
  }


  const bookedTableIds = bookedBookings.flatMap(booking => 
    (booking?.tableIds || []).map(id => id?.toString())
  );


  const uniqueBookedIds = [...new Set(bookedTableIds.filter(id => id))];
  
  return uniqueBookedIds;
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
 
  const result = await Booking.find({ userId }).sort({ createdAt: -1 });
  return result;
};

export const BookingServices = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getSingleBookingFromDB,
  updateBookingInDB,
  deleteBookingFromDB,
  getMyBookingsFromDB,
  getAvailableTablesFromDB,
};
