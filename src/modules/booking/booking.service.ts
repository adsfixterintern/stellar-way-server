// import { IBooking } from "./booking.interface";
// import { Booking } from "./booking.model";
// import { User } from "../user/user.model";

// const createBookingIntoDB = async (payload: IBooking) => {
//   const user = await User.findById(payload.userId);
//   if (!user) throw new Error("User not found!");

//   const existingBookings = await Booking.find({
//     date: payload.date,
//     tableIds: { $in: payload.tableIds },
//     $and: [
//       { startTime: { $lt: payload.endTime } },
//       { endTime: { $gt: payload.startTime } },
//     ],
//   });

//   if (existingBookings.length > 0) {
//     throw new Error(
//       "One or more selected tables are already booked for this time slot!",
//     );
//   }

//   const bookingData = {
//     ...payload,
//     name: user.name,
//     email: user.email,
//     phone: user.phone,
//     address: payload.address || "Not Specified",
//   };

//   const result = await Booking.create(bookingData);

//   return result;
// };

// const getAvailableTablesFromDB = async (date: string, startTime: string, endTime: string) => {

//   if (!date || !startTime || !endTime) return [];

//   const bookedBookings = await Booking.find({
//     date: date,
//     $and: [
//       { startTime: { $lt: endTime } },
//       { endTime: { $gt: startTime } }
//     ]
//   }).select('tableIds');

//   if (!bookedBookings || bookedBookings.length === 0) {
//     return [];
//   }

//   const bookedTableIds = bookedBookings.flatMap(booking =>
//     (booking?.tableIds || []).map(id => id?.toString())
//   );

//   const uniqueBookedIds = [...new Set(bookedTableIds.filter(id => id))];

//   return uniqueBookedIds;
// };

// const getAllBookingsFromDB = async (query: Record<string, unknown>) => {
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 10;
//   const skip = (page - 1) * limit;

//   const result = await Booking.find()
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit);

//   const total = await Booking.countDocuments();

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//       totalPage: Math.ceil(total / limit),
//     },
//     data: result,
//   };
// };

// const getSingleBookingFromDB = async (id: string) => {
//   const result = await Booking.findById(id);
//   return result;
// };

// const updateBookingInDB = async (id: string, payload: Partial<IBooking>) => {
//   const result = await Booking.findByIdAndUpdate(id, payload, {
//     new: true,
//     runValidators: true,
//   });
//   return result;
// };

// const deleteBookingFromDB = async (id: string) => {
//   const result = await Booking.findByIdAndDelete(id);
//   return result;
// };

// const getMyBookingsFromDB = async (userId: string) => {

//   const result = await Booking.find({ userId }).sort({ createdAt: -1 });
//   return result;
// };

// export const BookingServices = {
//   createBookingIntoDB,
//   getAllBookingsFromDB,
//   getSingleBookingFromDB,
//   updateBookingInDB,
//   deleteBookingFromDB,
//   getMyBookingsFromDB,
//   getAvailableTablesFromDB,
// };

import { IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { User } from "../user/user.model";

const createBookingIntoDB = async (payload: Partial<IBooking>) => {
  const { date, startTime, endTime, tableIds } = payload;

  const isAlreadyBooked = await Booking.findOne({
    date,
    paymentStatus: "paid",
    tableIds: { $in: tableIds },
    $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }],
  } as any);

  if (isAlreadyBooked) {
    throw new Error("One or more tables are already booked for this time.");
  }
  return await Booking.create(payload);
};

const getAvailableTablesFromDB = async (
  date: string,
  startTime: string,
  endTime: string,
) => {
  if (!date || !startTime || !endTime) return [];

  const bookedBookings = await Booking.find({
    date: date,
    paymentStatus: { $in: ["paid", "pending"] },
    $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }],
  }).select("tableIds");

  const bookedTableIds = bookedBookings.flatMap((booking) =>
    (booking?.tableIds || []).map((id) => id?.toString()),
  );

  return [...new Set(bookedTableIds.filter((id) => id))];
};

// ৩. অ্যাডমিন সব বুকিং দেখবে (Pagination & Filters সহ)
const getAllBookingsFromDB = async (query: Record<string, any>) => {
  const { transactionId, paymentStatus, page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = {};
  if (transactionId)
    filter.transactionId = { $regex: transactionId, $options: "i" };
  if (paymentStatus && paymentStatus !== "all")
    filter.paymentStatus = paymentStatus;

  const result = await Booking.find(filter)
    .populate("userId", "name email phone")
    .populate("tableIds")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Booking.countDocuments(filter);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit)),
    },
    data: result,
  };
};

const getSingleBookingFromDB = async (id: string) => {
  return await Booking.findById(id).populate("userId tableIds");
};

const updateBookingInDB = async (id: string, payload: Partial<IBooking>) => {
  return await Booking.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteBookingFromDB = async (id: string) => {
  return await Booking.findByIdAndDelete(id);
};

const getMyBookingsFromDB = async (userId: string) => {
  return await Booking.find({ userId })
    .populate("tableIds")
    .sort({ createdAt: -1 });
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
