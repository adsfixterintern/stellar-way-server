import { Types } from "mongoose";

export interface IRider {
  _id?: Types.ObjectId; 
  userId: Types.ObjectId; 
  phoneNumber: string; 
  vehicleType: 'bike' | 'cycle' | 'car';
  licenseNumber?: string;
  identityCard: string;
  area: string;
  status: 'pending' | 'active' | 'rejected'; 
  rating: number;         
  totalDeliveries: number; 
  isOnline?: boolean;
  isBusy?: boolean;
  lastLocation?: {
    lat: number;
    lng: number;
  };
}