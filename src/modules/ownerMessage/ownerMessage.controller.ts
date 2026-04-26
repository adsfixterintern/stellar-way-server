import { Request, Response } from "express";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { OwnerMessageService } from "./ownerMessage.service";
import { UploadService } from "../upload/upload.service";

// CREATE (with image upload)
const createOwnerMessage = catchAsync(async (req: Request, res: Response) => {
  const { message, ownerName, designation } = req.body;

  const fileData = UploadService.processSingleFile(
    req.file as Express.Multer.File,
  );

  if (!fileData) {
    throw new Error("Owner image is required!");
  }

  const result = await OwnerMessageService.createOwnerMessageIntoDB({
    message,
    ownerName,
    designation,
    image: fileData.url,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Owner message created successfully!",
    data: result,
  });
});

// GET
const getOwnerMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await OwnerMessageService.getOwnerMessageFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Owner message fetched successfully!",
    data: result,
  });
});

// UPDATE (optional new image)
const updateOwnerMessage = catchAsync(async (req: Request, res: Response) => {
  const { message, ownerName, designation } = req.body;

  let imageUrl: string | undefined;

  const fileData = req.file
    ? UploadService.processSingleFile(req.file as Express.Multer.File)
    : null;

  if (fileData) {
    imageUrl = fileData.url;
  }

  const result = await OwnerMessageService.updateOwnerMessageIntoDB({
    message,
    ownerName,
    designation,
    ...(imageUrl && { image: imageUrl }),
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Owner message updated successfully!",
    data: result,
  });
});

// RESET
const deleteOwnerMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await OwnerMessageService.deleteOwnerMessageFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Owner message reset successfully!",
    data: result,
  });
});

export const OwnerMessageController = {
  createOwnerMessage,
  getOwnerMessage,
  updateOwnerMessage,
  deleteOwnerMessage,
};
