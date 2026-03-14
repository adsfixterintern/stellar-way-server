import express from 'express';
import { MessageController } from './message.controller';

const router = express.Router();

router.post('/send-message', MessageController.createMessage);

router.get('/', MessageController.getAllMessages);
router.delete('/:id', MessageController.deleteMessage);

export const MessageRoutes = router;