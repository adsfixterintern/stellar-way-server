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

// ২. সব বুকিং দেখা (এখন পপুলেশন লাগবে না, ডাটা অলরেডি বুকিং কালেকশনেই আছে)
const getAllBookingsFromDB = async () => {
  const result = await Booking.find();
  return result;
};

// ৩. একটি নির্দিষ্ট বুকিং দেখা
const getSingleBookingFromDB = async (id: string) => {
  const result = await Booking.findById(id);
  return result;
};

// ৪. আপডেট করা
const updateBookingInDB = async (id: string, payload: Partial<IBooking>) => {
  const result = await Booking.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

// ৫. ডিলিট করা
const deleteBookingFromDB = async (id: string) => {
  const result = await Booking.findByIdAndDelete(id);
  return result;
};

export const BookingServices = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getSingleBookingFromDB,
  updateBookingInDB,
  deleteBookingFromDB,
};