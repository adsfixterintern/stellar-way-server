import express from 'express';
import { BookingControllers } from './booking.controller';

const router = express.Router();

router.post('/create-booking', BookingControllers.createBooking);
router.get('/', BookingControllers.getAllBookings);
router.get('/:id', BookingControllers.getSingleBooking);
router.patch('/:id', BookingControllers.updateBooking);
router.delete('/:id', BookingControllers.deleteBooking);

export const BookingRoutes = router;