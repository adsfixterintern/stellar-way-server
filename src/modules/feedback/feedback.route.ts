import { Router } from 'express';
import { FeedbackControllers } from './feedback.controller';
import { upload } from '../../app/config/cloudinary.config';

const router = Router();

router.post('/create-feedback', upload.single('image'), FeedbackControllers.createFeedback);
router.get("/all-feedback", FeedbackControllers.getAllFeedbacks);

export const FeedbackRoutes = router;