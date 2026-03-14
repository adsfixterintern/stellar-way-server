import { IEventBooking } from './eventBooking.interface';
import { EventBooking } from './eventBooking.model';

const createBookingIntoDB = async (payload: Partial<IEventBooking>) => {
  const result = await EventBooking.create(payload);
  return result;
};

export const EventBookingServices = {
  createBookingIntoDB,
};