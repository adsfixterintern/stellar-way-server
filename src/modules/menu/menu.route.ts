import express from 'express';
import { MenuController } from './menu.controller';
import { upload } from '../../app/config/cloudinary.config';
import { isAuthenticated } from '../../app/middlewares/auth.middleware';
import { authorizeRoles } from '../../app/middlewares/authorization.middleware';

const router = express.Router();

router.post('/create-menu',upload.single('image'),isAuthenticated,authorizeRoles('admin'), MenuController.createMenu);
router.get('/', MenuController.getAllMenus);
// admin
router.get('/low-stock',isAuthenticated,authorizeRoles('admin'), MenuController.getLowStockMenus);
router.get('/:id', MenuController.getSingleMenu); 
router.patch('/:id',upload.single('image'),isAuthenticated,authorizeRoles('admin','user','chef'), MenuController.updateMenu);  
router.delete('/:id',isAuthenticated,authorizeRoles('admin'), MenuController.deleteMenu); 


export const MenuRoutes = router;


