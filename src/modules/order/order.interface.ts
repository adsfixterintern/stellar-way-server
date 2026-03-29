import { Types } from 'mongoose';

export interface IOrder {
  customerInfo: {
    user: Types.ObjectId;
    name: string;
    email: string;
  };
  phone: string;
  address: string;
  items: {
    menuId: Types.ObjectId;
    quantity: number; 
    price: number;
  }[];
  totalPrice: number;
  paymentStatus: 'unpaid' | 'paid' | 'failed' | 'cancelled'; 
  deliveryStatus: 'pending' | 'confirmed' | 'cooking' | 'on-the-way' | 'delivered';
  paymentMethod: string;
  transactionId: string; 
  date: Date;
  deliveryOTP:string;
  isOTPVerified:boolean
}

