import { Schema, model } from "mongoose";
import { IBooking } from "./booking.interface";

const bookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, default: "Not Specified" },
    guest: { type: Number, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    tableIds: [{ type: Schema.Types.ObjectId, ref: "Table", required: true }],

    // পেমেন্ট সংক্রান্ত ফিল্ডস
    totalPrice: { type: Number, required: true },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true, // Fast lookup er jonno indexing kora holo
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["SSLCommerz", "Stripe"],
      required: true,
    },

    qrCode: { type: String, default: "" },
  },
  { timestamps: true },
);

// Export the model
export const Booking = model<IBooking>("Booking", bookingSchema, "booking");
