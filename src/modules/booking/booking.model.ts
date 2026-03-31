// booking.model.ts
import { Schema, model } from 'mongoose';
import { IBooking } from './booking.interface';

const bookingSchema = new Schema<IBooking>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: String,
  guest: Number,
  time: String,
  date: String
}, { timestamps: true });

export const Booking = model<IBooking>('Booking', bookingSchema, 'booking');