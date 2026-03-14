import { Router } from 'express';
import { ChefControllers } from './chef.controller';

const router = Router();

router.post('/create-chef', ChefControllers.createChef);
router.get('/', ChefControllers.getAllChefs);
router.get('/:id', ChefControllers.getSingleChef);
router.patch('/:id', ChefControllers.updateChef);
router.delete('/:id', ChefControllers.deleteChef);

export const ChefRoutes = router;