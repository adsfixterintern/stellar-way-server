import express from 'express';
import { BookingControllers } from './booking.controller';
import { isAuthenticated } from '../../app/middlewares/auth.middleware';

const router = express.Router();

router.post('/create-booking',isAuthenticated, BookingControllers.createBooking);
router.get('/', BookingControllers.getAllBookings);
router.get('/:id', BookingControllers.getSingleBooking);
router.patch('/:id', BookingControllers.updateBooking);
router.delete('/:id', BookingControllers.deleteBooking);

export const BookingRoutes = router;