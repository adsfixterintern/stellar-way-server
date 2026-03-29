import { Router } from 'express';
import { ChefControllers } from './chef.controller';
import { upload } from '../../app/config/cloudinary.config';

const router = Router();

router.post('/create-chef', upload.single('image'), ChefControllers.createChef);
router.get('/', ChefControllers.getAllChefs);
router.get('/:id', ChefControllers.getSingleChef);
router.patch('/:id',upload.single('image'), ChefControllers.updateChef);
router.delete('/:id', ChefControllers.deleteChef);

export const ChefRoutes = router;