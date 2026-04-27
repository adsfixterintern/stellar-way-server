import { Schema, model } from "mongoose";
import { IOffer } from "./offer.interface";

const offerSchema = new Schema<IOffer>(
  {
    title: { type: String, required: true },
    description: { type: String },
    discountPercentage: { type: Number, required: true },
    bannerImage: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    applicableMenus: [
      { type: Schema.Types.ObjectId, ref: "Menu", required: true },
    ],
  },
  { timestamps: true },
);

export const Offer = model<IOffer>("Offer", offerSchema);
