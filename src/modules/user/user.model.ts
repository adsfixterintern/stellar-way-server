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





