import { Types } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'admin' | 'user' | 'rider' | 'chef';
  status: 'active' | 'blocked';
  image?: string;

 resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

export interface IRider {
  userId: Types.ObjectId;
  image: string;
  rating: number; 
  totalDeliveries: number;
  status: 'active' | 'inactive' | 'terminated';
  vehicle: string;
}


