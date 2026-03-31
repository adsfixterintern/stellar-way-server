import { Router } from "express";
import { EventBookingControllers } from "./eventBooking.controller";
import { isAuthenticated } from "../../app/middlewares/auth.middleware";
import { authorizeRoles } from "../../app/middlewares/authorization.middleware";

const router = Router();

router.post("/create-ssl-booking",isAuthenticated,authorizeRoles('user'), EventBookingControllers.createSSLBooking);
router.post("/create-stripe-booking",isAuthenticated,authorizeRoles('user'),  EventBookingControllers.createStripeBooking);


router.post("/confirm-payment/:transactionId",isAuthenticated,authorizeRoles('user'),  EventBookingControllers.confirmPayment);
router.get("/confirm-payment/:transactionId",isAuthenticated,authorizeRoles('user'),  EventBookingControllers.confirmPayment);

router.get("/all-bookings",isAuthenticated,authorizeRoles('admin'),  EventBookingControllers.getAllBookings);
router.get("/analytics",isAuthenticated,authorizeRoles('admin'),EventBookingControllers.getBookingAnalytics);
router.get("/my-bookings/:userId",isAuthenticated,authorizeRoles('user'),  EventBookingControllers.getMyBookings);
router.get("/:id",isAuthenticated,authorizeRoles('user'), EventBookingControllers.getSingleBooking);
router.post("/confirm-payment/:transactionId",isAuthenticated,authorizeRoles('user'),  EventBookingControllers.confirmPayment);
router.get("/confirm-payment/:transactionId",isAuthenticated,authorizeRoles('user'),  EventBookingControllers.confirmPayment);
export const EventBookingRoutes = router;