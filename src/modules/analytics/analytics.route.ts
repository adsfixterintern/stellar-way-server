import express from 'express';
import { AnalyticsController } from './analytics.controller';
import { isAuthenticated } from '../../app/middlewares/auth.middleware';
import { authorizeRoles } from '../../app/middlewares/authorization.middleware';

const router = express.Router();

// ভিজিট ট্র্যাক করার জন্য (POST)
router.post('/track-visit', AnalyticsController.trackVisit);

// ড্যাশবোর্ডের ডাটা পাওয়ার জন্য (GET)
router.get('/stats',isAuthenticated,authorizeRoles('admin','chef','rider','user'), AnalyticsController.getTrafficStats);

export const AnalyticsRoutes = router;