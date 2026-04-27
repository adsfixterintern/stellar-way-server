import { Types } from "mongoose";

export interface IOffer {
  title: string;
  description?: string;
  discountPercentage: number;
  bannerImage?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  applicableMenus: Types.ObjectId[]; 
}
