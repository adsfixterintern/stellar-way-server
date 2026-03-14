import { Schema, model } from 'mongoose';
import { IMenu } from './menu.interface';


const menuSchema = new Schema<IMenu>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: {
    url: { type: String, required: true },
    publicId: { type: String, required: true }
  },
  stock: { type: Number, default: 0 },
  chefId: { type: Schema.Types.ObjectId, ref: 'Chef' },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  sortOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  reviews: [{
    rating: Number,
    comment: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
  }]
}, { timestamps: true });

export const Menu = model<IMenu>('Menu', menuSchema);