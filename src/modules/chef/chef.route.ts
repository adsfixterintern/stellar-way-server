import { Router } from 'express';
import { ChefControllers } from './chef.controller';
import { upload } from '../../app/config/cloudinary.config';
import { isAuthenticated } from '../../app/middlewares/auth.middleware';
import { authorizeRoles } from '../../app/middlewares/authorization.middleware';

const router = Router();

router.post('/create-chef', upload.single('image'),isAuthenticated,authorizeRoles('admin'), ChefControllers.createChef);
router.get('/', ChefControllers.getAllChefs);
router.get('/:id', ChefControllers.getSingleChef);
router.patch('/:id',upload.single('image'),isAuthenticated,authorizeRoles('admin','chef'), ChefControllers.updateChef);
router.delete('/:id',isAuthenticated,authorizeRoles('admin'), ChefControllers.deleteChef);

export const ChefRoutes = router;