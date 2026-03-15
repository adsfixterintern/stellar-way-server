import { Router } from 'express';
import { PaymentControllers } from './payment.controller';
import config from '../../app/config';

const router = Router();
router.post('/success/:transactionId', PaymentControllers.paymentSuccess);

router.post("/fail/:transactionId", (req, res) => {
    res.redirect(`${config.clientUrl}/payment/fail`);
});

router.post("/cancel/:transactionId", (req, res) => {
    res.redirect(`${config.clientUrl}/payment/cancel`);
})

export const PaymentRoutes = router;