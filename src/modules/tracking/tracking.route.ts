import express from 'express';
import { TrackingController } from './tracking.controller';

const router = express.Router();

router.patch('/update', TrackingController.updateLocation);


router.get('/:orderId', TrackingController.getTrackingDetails);

export const TrackingRoutes = router;