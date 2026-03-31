
import { Request, Response } from "express";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { SettingsServices } from "./settings.service";

const getSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingsServices.getSettingsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Settings fetched successfully",
    data: result,
  });
});

const updateSettings = catchAsync(async (req: Request, res: Response) => {
  const updateData = { ...req.body };

  if (req.file) {
    updateData.logo = (req.file as any).path; 
  }

 
  const result = await SettingsServices.updateSettingsIntoDB(updateData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Settings updated successfully",
    data: result,
  });
});

export const SettingsController = {
  getSettings,
  updateSettings,
};