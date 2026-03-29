import { Schema, model } from 'mongoose';
import { ITrafficSource } from './analytics.interface';

const trafficSchema = new Schema<ITrafficSource>({
  source: { type: String, enum: ['direct', 'social', 'organic'], required: true },
  count: { type: Number, default: 1 },
  date: { type: String, required: true }
});

// একই দিনে একই সোর্স থাকলে সেটা আপডেট হবে, ডুপ্লিকেট হবে না
trafficSchema.index({ source: 1, date: 1 }, { unique: true });

export const Traffic = model<ITrafficSource>('Traffic', trafficSchema);