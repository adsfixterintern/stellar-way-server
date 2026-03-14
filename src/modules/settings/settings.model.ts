import { Schema, model } from 'mongoose';
import { ISettings } from './settings.interface';

const settingsSchema = new Schema<ISettings>({
  siteName: { type: String, default: 'My Restaurant' },
  maintenanceMode: { type: Boolean, default: false },
  deliveryCharge: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
});

export const Settings = model<ISettings>('Settings', settingsSchema);