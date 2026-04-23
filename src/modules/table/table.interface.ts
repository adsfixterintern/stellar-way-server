import { Model } from 'mongoose';

export interface ITable {
  tableNumber: string;
  image: string;
  totalSeat: number;
  position: 'window-side' | 'center' | 'corner' | 'outdoor';
  description: string;
  status: 'available' | 'booked' | 'maintenance';
}

// যদি ভবিষ্যতে স্ট্যাটিক মেথড লাগে তার জন্য
export type TableModel = Model<ITable, Record<string, never>>;