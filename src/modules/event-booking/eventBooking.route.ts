import { Router } from 'express';
import { EventBookingControllers } from './eventBooking.controller';

const router = Router();

router.post(
  '/create-booking',
  EventBookingControllers.createBooking
);
router.get("/all-bookings", EventBookingControllers.getAllBookings);
router.get("/analytics", EventBookingControllers.getBookingAnalytics);
router.get("/my-bookings/:userId", EventBookingControllers.getMyBookings);
router.get("/:id", EventBookingControllers.getSingleBooking);


export const EventBookingRoutes = router;