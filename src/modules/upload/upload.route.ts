import express from 'express';
import { UploadControllers } from './upload.controller';
import { upload } from '../../app/config/cloudinary.config';

const router = express.Router();


router.post(
  '/upload-single',
  upload.single('image'), 
  UploadControllers.uploadSingleImage
);


router.post(
  '/upload-multiple',
  upload.array('images', 10), 
  UploadControllers.uploadMultipleImages
);


router.delete(
  '/delete-image',
  UploadControllers.deleteImage
);

export const uploadRoutes = router;