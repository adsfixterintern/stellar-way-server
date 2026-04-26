import { Schema, model } from "mongoose";
import { IEvent } from "./event.interface";

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    subTitle: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    seat: {
      type: Number,
      required: [true, "Total seat number is required"],
      min: [1, "Seats cannot be less than 1"],
    },
    availableSeat: {
      type: Number,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Event = model<IEvent>("Event", eventSchema);
