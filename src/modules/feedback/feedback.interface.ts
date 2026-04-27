import { Types } from "mongoose";

export interface ITestimonial {
  name: string;
  description: string;
  designation?: string;
  companyLogo?: string;
  image?: string;
  status?: "pending" | "published";
  userId: Types.ObjectId;
}