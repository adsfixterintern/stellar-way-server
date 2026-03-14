import { Router } from 'express';
import { EventBookingControllers } from './eventBooking.controller';

const router = Router();

router.post(
  '/create-booking',
  EventBookingControllers.createBooking
);

export const EventBookingRoutes = router;