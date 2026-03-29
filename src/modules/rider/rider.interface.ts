import { Types } from "mongoose";

export interface IRider {
  userId: Types.ObjectId;
  phoneNumber: string; 
  vehicleType: 'bike' | 'cycle' | 'car';
  licenseNumber?: string;
  identityCard: string;
  area: string;
  status: 'pending' | 'active' | 'rejected'; 
  rating: number;         
  totalDeliveries?: number; 
}