import express from 'express';
import { OrderControllers } from './order.controller';

const router = express.Router();

router.post('/create-order', OrderControllers.createOrder);
router.get('/', OrderControllers.getAllOrders);
router.get('/:email', OrderControllers.getMyOrders);
router.get('/details/:id', OrderControllers.getOrderDetails);
router.patch('/status/:id', OrderControllers.updatePaymentStatus);
router.patch('/delivery/:id', OrderControllers.updateDeliveryStatus);
router.post('/create-stripe-order', OrderControllers.createStripeOrder);
export const OrderRoutes = router;