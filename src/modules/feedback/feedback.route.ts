import { Router } from 'express';
import { FeedbackControllers } from './feedback.controller';

const router = Router();

router.post('/create-feedback', FeedbackControllers.createFeedback);
router.get("/all-feedback", FeedbackControllers.getAllFeedbacks);

export const FeedbackRoutes = router;