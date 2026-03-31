import express from 'express';
import { getRiderStatsAndOrders, OrderControllers, updateDeliveryStatus } from './order.controller';
import { isAuthenticated } from '../../app/middlewares/auth.middleware';
import { authorizeRoles } from '../../app/middlewares/authorization.middleware';

const router = express.Router();

router.post('/create-order',isAuthenticated,authorizeRoles('user'), OrderControllers.createOrder);
router.get('/',isAuthenticated,authorizeRoles('admin'), OrderControllers.getAllOrders);
router.get('/:email',isAuthenticated,authorizeRoles('user','rider'), OrderControllers.getMyOrders);
router.get('/details/:id',isAuthenticated, OrderControllers.getOrderDetails);
router.patch('/status/:id',isAuthenticated, OrderControllers.updatePaymentStatus);
router.patch("/update-delivery-status/:id",isAuthenticated,authorizeRoles('rider'), updateDeliveryStatus);
router.post('/create-stripe-order',isAuthenticated,authorizeRoles('user'), OrderControllers.createStripeOrder);
router.patch('/status-by-transaction/:transactionId', OrderControllers.updatePaymentStatusByTransactionId);
router.get('/stats/overview',isAuthenticated,authorizeRoles('admin','rider','user'), OrderControllers.getOrderStats);
router.post("/payment/fail/:transactionId",isAuthenticated,authorizeRoles('user'), OrderControllers.paymentFailed);
router.post("/payment/cancel/:transactionId",isAuthenticated,authorizeRoles('user'), OrderControllers.paymentCancelled);
router.get("/rider-stats/:email",isAuthenticated,authorizeRoles('rider'), getRiderStatsAndOrders);

export const OrderRoutes = router;