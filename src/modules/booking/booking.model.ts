import { Schema, model } from 'mongoose';
import { IBooking } from './booking.interface';

const bookingSchema = new Schema<IBooking>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, default: "Not Specified" },
  guest: { type: Number, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  tableIds: [{ type: Schema.Types.ObjectId, ref: 'Table', required: true }]
}, { timestamps: true });

export const Booking = model<IBooking>('Booking', bookingSchema, 'booking');