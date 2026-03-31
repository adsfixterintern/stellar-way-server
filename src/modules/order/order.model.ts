import { Schema, model } from "mongoose";
import { IOrder } from "./order.interface";

const orderSchema = new Schema<IOrder>(
  {
    customerInfo: {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    items: [
      {
        menuId: { type: Schema.Types.ObjectId, ref: "Menu", required: true },
        quantity: { type: Number, required: true }, 
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed", "cancelled"],
      default: "unpaid", 
    },
    deliveryStatus: {
      type: String,
      enum: ["pending", "confirmed", "cooking", "on-the-way", "delivered"],
      default: "pending",
    },
    transactionId: { type: String, required: true },
    paymentMethod: { type: String, default: "SSLCommerz" },
    date: { type: Date, default: Date.now },
    deliveryOTP: { type: String },
    isOTPVerified: { type: Boolean, default: false },
   riderId: { 
      type: Schema.Types.ObjectId, 
      ref: "RiderModel", 
      default: null 
    },

  },
  { timestamps: true },
);

export const Order = model<IOrder>('Order', orderSchema);
