import { Schema, model } from 'mongoose';
import { IUser, IRider } from './user.interface';


const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['admin', 'user', 'rider', 'chef'], default: 'user' },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  image: { type: String },

  // for reset pass 
 
 resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }


}, { timestamps: true });




export const User = model<IUser>('User', userSchema);

const riderSchema = new Schema<IRider>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, default: 5 },
  totalDeliveries: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive', 'terminated'], default: 'active' },
  vehicle: String
});

export const Rider = model<IRider>('Rider', riderSchema);



