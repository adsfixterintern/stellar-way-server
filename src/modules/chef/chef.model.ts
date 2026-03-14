import { Schema, model } from 'mongoose';
import { IChef } from './chef.interface';

const chefSchema = new Schema<IChef>({
  name: { type: String, required: true },
  image: { type: String, required: true }, 
  designation: String,
  bio: String,        
  speciality: String, 
  rating: { type: Number, default: 5 },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' }
});

export const Chef = model<IChef>('Chef', chefSchema);