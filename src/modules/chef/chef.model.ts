import { Schema, model } from 'mongoose';
import { IChef } from './chef.interface';

const reviewSchema = new Schema(
  {
    rating: { type: Number, required: true },
    comment: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    menuId: { type: Schema.Types.ObjectId, ref: 'Menu' },
  },
  { timestamps: true }
);

const chefSchema = new Schema<IChef>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  designation: String,
  bio: String,
  speciality: String,
  rating: { type: Number, default: 5 },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },
  reviews: { type: [reviewSchema], default: [] }, // ✅ reviews array add হলো
});

export const Chef = model<IChef>('Chef', chefSchema);