import { Schema, model, models, Model } from 'mongoose';
import { IRider } from './rider.interface';

const riderSchema = new Schema<IRider>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  vehicleType: { type: String, enum: ['bike', 'cycle', 'car'], required: true },
  licenseNumber: { type: String },
  identityCard: { type: String, required: true },
  area: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'rejected'], 
    default: 'pending',
    lowercase: true,
    trim: true
  },
  rating: { 
    type: Number, 
    default: 0
  },
  totalDeliveries: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });


export const Rider = (models.RiderModel as Model<IRider>) || model<IRider>('RiderModel', riderSchema);