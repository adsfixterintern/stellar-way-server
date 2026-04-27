import { Schema, model } from 'mongoose';
import { ICategory } from './category.interface';

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    sortOrder: { type: Number, default: 0 },
    status: { 
      type: String, 
      enum: ['active', 'inactive'], 
      default: 'active' 
    },
  },
  { timestamps: true }
);

export const Category = model<ICategory>('Category', categorySchema);