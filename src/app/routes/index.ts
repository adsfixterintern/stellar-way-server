import { Router } from 'express';
import { MenuRoutes } from '../../modules/menu/menu.route';
import { FaqRoutes } from '../../modules/faq/faq.routes';
import path from 'node:path';
import { FeedbackRoutes } from '../../modules/feedback/feedback.route';

const router = Router();

const moduleRoutes = [
  { 
    path: '/menu', 
    route: MenuRoutes 
  },
  {
    path: "/faq", 
    route: FaqRoutes 
  },
  {
    path: "/feedback",
    route: FeedbackRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;