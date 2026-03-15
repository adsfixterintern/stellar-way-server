import { Router } from 'express';
import { EventControllers } from './event.controller';
import { upload } from '../../app/config/cloudinary.config';

const router = Router();

router.post(
  '/create-event',
  upload.single('image'), 
  EventControllers.createEvent
);
router.get("/event", EventControllers.getAllEvents);
router.get("/event/:id", EventControllers.getSingleEvent);
router.put("/event/:id", upload.single("image"), EventControllers.updateEvent);
router.delete("/event/:id", EventControllers.deleteEvent);
export const EventRoutes = router;