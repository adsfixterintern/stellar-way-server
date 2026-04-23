import { Schema, model } from "mongoose";
import { ITestimonial } from "./feedback.interface";
const testimonialSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  designation: { type: String, required: true },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'published'], 
    default: 'pending' 
  }
}, { timestamps: true });

export const Testimonial = model<ITestimonial>(
  "Testimonial",
  testimonialSchema
);