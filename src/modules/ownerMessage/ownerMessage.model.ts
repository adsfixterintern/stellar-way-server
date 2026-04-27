import { Schema, model } from "mongoose";
import { IOwnerMessage } from "./ownerMessage.interface";

const ownerMessageSchema = new Schema<IOwnerMessage>(
  {
    message: { type: String, default: "" },
    ownerName: { type: String, default: "" },
    designation: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { timestamps: true },
);

export const OwnerMessage = model<IOwnerMessage>(
  "OwnerMessage",
  ownerMessageSchema,
);
