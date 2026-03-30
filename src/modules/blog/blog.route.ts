import express from 'express';
import { BlogController } from './blog.controller';
import { upload } from '../../app/config/cloudinary.config';
import { isAuthenticated } from '../../app/middlewares/auth.middleware';
import { authorizeRoles } from '../../app/middlewares/authorization.middleware';

const router = express.Router();

router.post(
  '/create-blog',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'sectionImages', maxCount: 10 }
  ]),isAuthenticated,authorizeRoles('admin'),
  BlogController.createBlog
);

router.get('/',isAuthenticated, BlogController.getAllBlogs);


router.get('/:id',isAuthenticated, BlogController.getSingleBlog);


router.patch(
  '/:id',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'sectionImages', maxCount: 10 }
  ]),isAuthenticated,authorizeRoles('admin'),
  BlogController.updateBlog
);


router.delete('/:id',isAuthenticated,authorizeRoles('admin'), BlogController.deleteBlog);

export const BlogRoutes = router;