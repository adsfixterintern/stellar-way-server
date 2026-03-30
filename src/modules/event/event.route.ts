import { Router } from 'express';
import { EventControllers } from './event.controller';
import { upload } from '../../app/config/cloudinary.config';
import { isAuthenticated } from '../../app/middlewares/auth.middleware';
import { authorizeRoles } from '../../app/middlewares/authorization.middleware';

const router = Router();

router.post(
  '/create-event',
  upload.single('image'),
  isAuthenticated,
  authorizeRoles('admin'),
  EventControllers.createEvent
);
router.get("/event",isAuthenticated,authorizeRoles('admin','chef','rider','rider'), EventControllers.getAllEvents);
router.get("/event/:id",isAuthenticated,authorizeRoles('admin','chef','rider','user'), EventControllers.getSingleEvent);
router.put("/event/:id", upload.single("image"),isAuthenticated,authorizeRoles('admin'),EventControllers.updateEvent);
router.delete("/event/:id",isAuthenticated,authorizeRoles('admin'), EventControllers.deleteEvent);
export const EventRoutes = router;