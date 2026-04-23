import { Schema, model } from 'mongoose';
import { ITable, TableModel } from './table.interface';

const tableSchema = new Schema<ITable>(
  {
    tableNumber: { 
      type: String, 
      required: true, 
      unique: true 
    },
    image: { 
      type: String, 
      required: true 
    },
    totalSeat: { 
      type: Number, 
      required: true 
    },
    position: { 
      type: String, 
      enum: ['window-side', 'center', 'corner', 'outdoor'], 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['available', 'booked', 'maintenance'], 
      default: 'available' 
    },
  },
  {
    timestamps: true,
  }
);

export const Table = model<ITable, TableModel>('Table', tableSchema);