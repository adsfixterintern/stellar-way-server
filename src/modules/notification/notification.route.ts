import express from 'express';
import {
  createNotification,
  deleteNotification,
  getUserNotificationsByEmail,
  markAsRead,
  clearAllNotificationsByEmail,
} from './notification.controller';
import { isAuthenticated } from '../../app/middlewares/auth.middleware';
import { authorizeRoles } from '../../app/middlewares/authorization.middleware';

const router = express.Router();


router.get('/:email',isAuthenticated, getUserNotificationsByEmail);


router.post('/', createNotification);


router.patch('/:id', markAsRead);


router.delete('/:id',isAuthenticated, deleteNotification);


router.delete('/clear/:email',isAuthenticated, clearAllNotificationsByEmail);

export const NotificationRoutes = router;