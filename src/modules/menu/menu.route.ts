import express from 'express';
import { MenuController } from './menu.controller';

const router = express.Router();

router.post('/create-menu', MenuController.createMenu);
router.get('/', MenuController.getAllMenus);
router.get('/:id', MenuController.getSingleMenu); 
router.patch('/:id', MenuController.updateMenu);  
router.delete('/:id', MenuController.deleteMenu); 

export const MenuRoutes = router;