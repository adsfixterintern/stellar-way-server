import { Request, Response } from 'express';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { Gallery } from './gallery.model';
import { UploadService } from '../upload/upload.service'; 

const createGalleryItem = catchAsync(async (req: Request, res: Response) => {
  const { categoryId, sortOrder } = req.body;
  
  const fileData = UploadService.processSingleFile(req.file as Express.Multer.File);

  if (!fileData) {
    throw new Error('Image file is required!');
  }

  const result = await Gallery.create({
    image: fileData.url, 
    categoryId,
    sortOrder: sortOrder || 0,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Gallery item created successfully!',
    data: result,
  });
});
const getAllGalleryItems = catchAsync(async (req: Request, res: Response) => {
  const result = await Gallery.find()
    .populate('categoryId') 
    .sort({ sortOrder: 1, createdAt: -1 });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Gallery items fetched successfully!',
    data: result,
  });
});

// ৩. গ্যালারি আইটেম ডিলিট করা
const deleteGalleryItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const item = await Gallery.findById(id);
  if (!item) {
    throw new Error('Item not found!');
  }
  const publicId = item.image.split('/').pop()?.split('.')[0] || ''; 
  
  if (publicId) {
    await UploadService.deleteImageFromCloudinary(publicId);
  }

  await Gallery.findByIdAndDelete(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Gallery item deleted successfully!',
    data: null,
  });
});

export const GalleryControllers = {
  createGalleryItem,
  getAllGalleryItems, // এখন এটি স্কোপে আছে
  deleteGalleryItem,
};