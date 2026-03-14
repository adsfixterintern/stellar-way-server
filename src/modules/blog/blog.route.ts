import express from 'express';
import { BlogController } from './blog.controller';
import { upload } from '../../app/config/cloudinary.config';

const router = express.Router();

router.post(
  '/create-blog',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'sectionImages', maxCount: 10 }
  ]),
  BlogController.createBlog
);

router.get('/', BlogController.getAllBlogs);


router.get('/:id', BlogController.getSingleBlog);


router.patch(
  '/:id',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'sectionImages', maxCount: 10 }
  ]),
  BlogController.updateBlog
);


router.delete('/:id', BlogController.deleteBlog);

export const BlogRoutes = router;