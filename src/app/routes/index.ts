import { Router } from 'express';
import { MenuRoutes } from '../../modules/menu/menu.route';
import { MessageRoutes } from '../../modules/message/message.route';
import { CategoryRoutes } from '../../modules/category/category.route';
import { uploadRoutes } from '../../modules/upload/upload.route';

const router = Router();

const moduleRoutes = [
  { path: '/menu', route: MenuRoutes },
  {path:'/messages', route:MessageRoutes},
  {path: '/categories', route: CategoryRoutes},
  {path:'/uploads', route: uploadRoutes}
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;


