import { Types } from 'mongoose';

export interface INotification {
  title: string;
  message: string;
  type: 'order' | 'event' | 'system';
  userId: Types.ObjectId;
  status?: 'read' | 'unread';
  createdAt: Date;
  updatedAt: Date;
}