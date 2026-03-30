import express from 'express';
import {
  createNotification,
  deleteNotification,
  getUserNotificationsByEmail,
  markAsRead,
  clearAllNotificationsByEmail,
} from './notification.controller';

const router = express.Router();


router.get('/:email', getUserNotificationsByEmail);


router.post('/', createNotification);


router.patch('/:id', markAsRead);


router.delete('/:id', deleteNotification);


router.delete('/clear/:email', clearAllNotificationsByEmail);

export const NotificationRoutes = router;