import { Types } from 'mongoose';

export interface IBooking {
  userId: Types.ObjectId;
  name: string; 
  email: string; 
  phone: string; 
  address: string;
  guest: number;
  time: string;
  date: string;
}