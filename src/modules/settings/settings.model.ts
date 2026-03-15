// import { Schema, model } from "mongoose";
// import { ISettings } from "./settings.interface";

// const settingsSchema = new Schema<ISettings>({
//   siteName: { type: String, default: "My Restaurant" },
//   maintenanceMode: { type: Boolean, default: false },
//   deliveryCharge: { type: Number, default: 0 },
//   tax: { type: Number, default: 0 },
//   logo: {
//     type: String,
//     default: "",
//   },
// });

// export const Settings = model<ISettings>("Settings", settingsSchema);

import { Schema, model } from "mongoose";
import { ISettings } from "./settings.interface";

const settingsSchema = new Schema<ISettings>({
  siteName: { type: String, default: "My Restaurant" },
  logo: { type: String, default: "" },
  location: { type: String, default: "" },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  deliveryCharge: {
    insideDhaka: { type: Number, default: 60 },
    outsideDhaka: { type: Number, default: 120 },
  },
  tax: { type: Number, default: 0 },
  maintenanceMode: { type: Boolean, default: false },
});

export const Settings = model<ISettings>("Settings", settingsSchema);