import { Router } from 'express';
import { RiderControllers } from './rider.controller';


const router = Router();
console.log("Rider Router is hit!");

router.post('/create-rider', RiderControllers.createRider);
router.get('/', RiderControllers.getAllRiders);
router.get('/:id', RiderControllers.getSingleRider);
router.patch('/:id', RiderControllers.updateRider);
router.delete('/:id', RiderControllers.deleteRider);
router.post('/verify-otp', RiderControllers.completeDeliveryWithOTP);


export const RiderRoutes = router;