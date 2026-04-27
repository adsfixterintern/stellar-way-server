import { Schema, model } from "mongoose";
import { IContactMessage } from "./contact.interface";

const contactSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "read", "replied"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Contact = model<IContactMessage>("Contact", contactSchema);
