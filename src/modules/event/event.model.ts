import { Schema, model } from 'mongoose';
import { IEvent } from './event.interface';

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    subTitle: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true },
    image: { type: String, required: true },
    seat: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['active', 'expired'], 
      default: 'active' 
    },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Event = model<IEvent>('Event', eventSchema);