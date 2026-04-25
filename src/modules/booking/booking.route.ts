import express from 'express';
import { BookingControllers } from './booking.controller';
import { isAuthenticated } from '../../app/middlewares/auth.middleware';
import { authorizeRoles } from '../../app/middlewares/authorization.middleware';

const router = express.Router();
router.get('/check-availability', BookingControllers.checkAvailability);

router.post('/my-bookings',isAuthenticated,authorizeRoles('user'), BookingControllers.getMyBookings);


router.post('/create-booking',isAuthenticated,authorizeRoles('user','admin','rider','chef'), BookingControllers.createBooking);
router.get('/',isAuthenticated,authorizeRoles('admin'), BookingControllers.getAllBookings);

router.get('/:id',isAuthenticated,authorizeRoles('user'), BookingControllers.getSingleBooking);
router.patch('/:id',isAuthenticated,authorizeRoles('user'), BookingControllers.updateBooking);
router.delete('/:id',isAuthenticated,authorizeRoles('user','admin'), BookingControllers.deleteBooking);



export const BookingRoutes = router;