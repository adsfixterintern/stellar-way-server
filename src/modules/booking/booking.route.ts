import express from 'express';
import { BookingControllers } from './booking.controller';
import { isAuthenticated } from '../../app/middlewares/auth.middleware';

const router = express.Router();

// ১. নতুন রাউট যোগ করুন (এটি অবশ্যই /:id এর উপরে রাখবেন)
router.post('/my-bookings', BookingControllers.getMyBookings);

// ২. আপনার বিদ্যমান রাউটগুলো
router.post('/create-booking', BookingControllers.createBooking);
router.get('/', BookingControllers.getAllBookings);
router.get('/:id', BookingControllers.getSingleBooking);
router.patch('/:id', BookingControllers.updateBooking);
router.delete('/:id', BookingControllers.deleteBooking);

export const BookingRoutes = router;