import express from 'express';
import { MenuController } from './menu.controller';
import { upload } from '../../app/config/cloudinary.config';

const router = express.Router();

router.post('/create-menu',upload.single('image'), MenuController.createMenu);
router.get('/', MenuController.getAllMenus);
// admin
router.get('/low-stock', MenuController.getLowStockMenus);
router.get('/:id', MenuController.getSingleMenu); 
router.patch('/:id',upload.single('image'), MenuController.updateMenu);  
router.delete('/:id', MenuController.deleteMenu); 


export const MenuRoutes = router;


