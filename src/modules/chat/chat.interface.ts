import { Types } from 'mongoose';

export interface ISingleMessage {
  sender: Types.ObjectId;
  senderModel: 'User' | 'Rider';
  message: string;
  isRead: boolean;
  time?: Date;
}

export interface IChat {
  orderId: Types.ObjectId;
  messages: ISingleMessage[];
}