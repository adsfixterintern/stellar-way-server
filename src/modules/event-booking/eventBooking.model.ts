import { Schema, model } from "mongoose";
import { IEventBooking } from "./eventBooking.interface";
const eventBookingSchema = new Schema<IEventBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    numberOfSeats: {
      type: Number,
      required: true,
      default: 1,
    },
    selectedDate: {
      type: String,
      required: true,
    },
    selectedTime: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["SSLCommerz", "Stripe"],
      required: true,
    },
    qrCode: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);
export const EventBooking = model<IEventBooking>(
  "EventBooking",
  eventBookingSchema,
);
