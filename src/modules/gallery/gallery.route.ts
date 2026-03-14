import express from 'express';
import { GalleryControllers } from './gallery.controller';
import { upload } from '../../app/config/cloudinary.config';
const router = express.Router();
router.post(
  '/', 
  upload.single('image'), 
  GalleryControllers.createGalleryItem
);
router.get('/', GalleryControllers.getAllGalleryItems);
router.delete('/:id', GalleryControllers.deleteGalleryItem);
export const GalleryRoutes = router;