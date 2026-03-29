import { Schema, model } from 'mongoose';
import { ITracking } from './tracking.interface';

const trackingSchema = new Schema<ITracking>(
  {
    orderId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Order', 
      required: true,
      unique: true, 
      index: true   
    },
    riderId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true 
    },
    status: { 
      type: String, 
      enum: ['order-picked', 'on-the-way', 'near-location', 'delivered'],
      default: 'order-picked'
    },
    currentLocation: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 }
    },
  }, 
  { 
    timestamps: true 
  }
);

trackingSchema.index({ orderId: 1, riderId: 1 });

export const Tracking = model<ITracking>('Tracking', trackingSchema);