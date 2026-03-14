import { model, Schema } from "mongoose";
import { IFaq } from "./faq.interface";

const faqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  {
    timestamps: true, // এটি অটো createdAt এবং updatedAt তৈরি করবে
  }
);

export const FaqModel = model<IFaq>('Faq', faqSchema);