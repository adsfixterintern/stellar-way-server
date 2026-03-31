import express from 'express';
import { ChatController } from './chat.controller';
import { isAuthenticated } from '../../app/middlewares/auth.middleware';
import { authorizeRoles } from '../../app/middlewares/authorization.middleware';

const router = express.Router();

router.post('/send',isAuthenticated,authorizeRoles('rider','user'), ChatController.saveMessage);
router.get('/:orderId',isAuthenticated,authorizeRoles('rider','user'), ChatController.getOrderMessages);

export const ChatRoutes = router;