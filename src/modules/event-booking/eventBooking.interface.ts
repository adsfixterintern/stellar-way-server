import { Types } from 'mongoose';

export interface IEventBooking {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  numberOfSeats: number;
  totalAmount: number;
  transactionId: string;
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  bookingDate: Date;
}