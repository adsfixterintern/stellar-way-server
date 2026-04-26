import { Model } from 'mongoose';

export interface ITable {
  tableNumber: string;
  image: string;
  totalSeat: number;
  position: 'window-side' | 'center' | 'corner' | 'outdoor';
  description: string;
  status: 'available' | 'booked' | 'maintenance';
}

export type TableModel = Model<ITable, Record<string, never>>;