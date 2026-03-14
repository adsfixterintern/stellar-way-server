import { Types } from 'mongoose';

export interface IMessage {
  orderId: Types.ObjectId;
  sender: Types.ObjectId; 
  senderModel: 'User' | 'Rider'; 
  message: string;
  isRead: boolean;
}