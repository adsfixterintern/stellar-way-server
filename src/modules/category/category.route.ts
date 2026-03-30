import express from 'express';
import { CategoryController } from './category.controller';
import { isAuthenticated } from '../../app/middlewares/auth.middleware';
import { authorizeRoles } from '../../app/middlewares/authorization.middleware';

const router = express.Router();

router.post('/create-category',isAuthenticated,authorizeRoles('admin'), CategoryController.createCategory);
router.get('/', CategoryController.getAllCategories);
router.patch('/:id',isAuthenticated,authorizeRoles('admin'), CategoryController.updateCategory);
router.delete('/:id',isAuthenticated,authorizeRoles('admin'), CategoryController.deleteCategory);

export const CategoryRoutes = router;