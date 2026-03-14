import express from 'express';
import { ChatController } from './chat.controller';

const router = express.Router();

router.post('/send', ChatController.saveMessage);
router.get('/:orderId', ChatController.getOrderMessages);

export const ChatRoutes = router;