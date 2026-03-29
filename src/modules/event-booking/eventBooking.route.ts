import { Router } from "express";
import { EventBookingControllers } from "./eventBooking.controller";

const router = Router();

router.post("/create-ssl-booking", EventBookingControllers.createSSLBooking);
router.post("/create-stripe-booking", EventBookingControllers.createStripeBooking);


router.post("/confirm-payment/:transactionId", EventBookingControllers.confirmPayment);
router.get("/confirm-payment/:transactionId", EventBookingControllers.confirmPayment);

router.get("/all-bookings", EventBookingControllers.getAllBookings);
router.get("/analytics", EventBookingControllers.getBookingAnalytics);
router.get("/my-bookings/:userId", EventBookingControllers.getMyBookings);
router.get("/:id", EventBookingControllers.getSingleBooking);
router.post("/confirm-payment/:transactionId", EventBookingControllers.confirmPayment);
router.get("/confirm-payment/:transactionId", EventBookingControllers.confirmPayment);
export const EventBookingRoutes = router;