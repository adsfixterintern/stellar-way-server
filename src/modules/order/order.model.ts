import { Schema, model } from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>({
  customerInfo: {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String
  },
  deliveryStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cooking', 'on-the-way', 'delivered'],
    default: 'pending' 
  },
  riderId: { type: Schema.Types.ObjectId, ref: 'Rider' },
  totalPrice: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export const Order = model<IOrder>('Order', orderSchema);
