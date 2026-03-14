import { Router } from 'express';
import { MenuRoutes } from '../../modules/menu/menu.route';

const router = Router();

const moduleRoutes = [
  { path: '/menu', route: MenuRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;