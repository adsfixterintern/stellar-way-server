import express from 'express';
import { getRiderStatsAndOrders, OrderControllers, updateDeliveryStatus } from './order.controller';

const router = express.Router();

router.post('/create-order', OrderControllers.createOrder);
router.get('/', OrderControllers.getAllOrders);
router.get('/:email', OrderControllers.getMyOrders);
router.get('/details/:id', OrderControllers.getOrderDetails);
router.patch('/status/:id', OrderControllers.updatePaymentStatus);
router.patch("/update-delivery-status/:id", updateDeliveryStatus);
router.post('/create-stripe-order', OrderControllers.createStripeOrder);
router.patch('/status-by-transaction/:transactionId', OrderControllers.updatePaymentStatusByTransactionId);
router.get('/stats/overview', OrderControllers.getOrderStats);
router.post("/payment/fail/:transactionId", OrderControllers.paymentFailed);
router.post("/payment/cancel/:transactionId", OrderControllers.paymentCancelled);
router.get("/rider-stats/:email", getRiderStatsAndOrders);

export const OrderRoutes = router;