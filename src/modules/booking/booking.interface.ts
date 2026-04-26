// import { Types } from 'mongoose';

// export interface IBooking {
//   userId: Types.ObjectId;
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   guest: number;
//   date: string;       // YYYY-MM-DD
//   startTime: string;  // Arrival Time
//   endTime: string;    // Departure Time
//   tableIds: Types.ObjectId[]; // Multiple Tables
// }

import { Types } from "mongoose";

export interface IBooking {
  userId: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address: string;
  guest: number;
  date: string;
  startTime: string;
  endTime: string;
  tableIds: Types.ObjectId[];
  qrCode: string;
  totalPrice: number;
  transactionId: string;
  paymentStatus: "pending" | "paid" | "cancelled";
  paymentMethod: "SSLCommerz" | "Stripe";
}
