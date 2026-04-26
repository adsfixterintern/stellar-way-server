import { Router } from "express";
import { EventBookingControllers } from "./eventBooking.controller";
import { isAuthenticated } from "../../app/middlewares/auth.middleware";
import { authorizeRoles } from "../../app/middlewares/authorization.middleware";

const router = Router();

// --- Public Routes ---
router.post(
  "/confirm-payment/:transactionId",
  EventBookingControllers.confirmPayment,
);
router.get(
  "/confirm-payment/:transactionId",
  EventBookingControllers.confirmPayment,
);

// --- Protected Routes ---
router.post(
  "/create-ssl-booking",
  isAuthenticated,
  authorizeRoles("user", "admin", "chef", "rider"),
  EventBookingControllers.createSSLBooking,
);

router.post(
  "/create-stripe-booking",
  isAuthenticated,
  authorizeRoles("user", "admin", "chef", "rider"),
  EventBookingControllers.createStripeBooking,
);

router.get(
  "/my-bookings/:userId",
  isAuthenticated,
  authorizeRoles("user", "admin", "chef", "rider"),
  EventBookingControllers.getMyBookings,
);

router.get(
  "/all-bookings",
  isAuthenticated,
  authorizeRoles("admin"),
  EventBookingControllers.getAllBookings,
);

router.get(
  "/analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  EventBookingControllers.getBookingAnalytics,
);

router.get(
  "/:id",
  isAuthenticated,
  authorizeRoles("user", "admin", "chef", "rider"),
  EventBookingControllers.getSingleBooking,
);

router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  EventBookingControllers.deleteBooking,
);

export const EventBookingRoutes = router;
