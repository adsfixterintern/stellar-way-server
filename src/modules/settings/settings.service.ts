

import { ISettings } from "./settings.interface";
import { Settings } from "./settings.model";

const getSettingsFromDB = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    // Prothom bar data na thakle default value diye create korbe
    settings = await Settings.create({}); 
  }
  return settings;
};

const updateSettingsIntoDB = async (payload: Partial<ISettings>) => {
  const settings = await Settings.findOne();
  
  if (!settings) {
    return await Settings.create(payload);
  }

  // Ekhane update korar shomoy nested objects handle korbe
  return await Settings.findByIdAndUpdate(settings._id, payload, {
    new: true,
    runValidators: true,
  });
};

export const SettingsServices = {
  getSettingsFromDB,
  updateSettingsIntoDB,
};