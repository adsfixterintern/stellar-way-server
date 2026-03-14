import { Schema, model } from 'mongoose';
import { IEventBooking } from './eventBooking.interface';

const eventBookingSchema = new Schema<IEventBooking>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  eventId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  numberOfSeats: { 
    type: Number, 
    required: true,
    default: 1 
  },
  transactionId: {
     type: String, 
     required: true 
    },
  totalAmount: { 
    type: Number,
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'cancelled'], 
    default: 'pending' 
  },
  bookingDate: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

eventBookingSchema.index({ userId: 1, eventId: 1 });

export const EventBooking = model<IEventBooking>('EventBooking', eventBookingSchema);