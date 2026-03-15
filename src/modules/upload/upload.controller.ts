import { Request, Response } from 'express';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { UploadService } from './upload.service';

const uploadSingleImage = catchAsync(async (req: Request, res: Response) => {
  const result = await UploadService.processSingleFile(req.file as Express.Multer.File);

  if (!result) {
    throw new Error('No file selected!');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Image uploaded successfully!',
    data: result,
  });
});


const uploadMultipleImages = catchAsync(async (req: Request, res: Response) => {
  const result = UploadService.processMultipleFiles(req.files as Express.Multer.File[]);

  if (result.length === 0) {
    throw new Error('No files selected!');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Images uploaded successfully!',
    data: result,
  });
});

const deleteImage = catchAsync(async (req: Request, res: Response) => {
  const { publicId } = req.body;

  if (!publicId) {
    throw new Error('Public ID is required to delete image!');
  }

  await UploadService.deleteImageFromCloudinary(publicId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Image deleted from Cloudinary successfully!',
    data: null,
  });
});

export const UploadControllers = {
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
};