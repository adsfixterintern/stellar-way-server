import express from 'express';
import { AnalyticsController } from './analytics.controller';

const router = express.Router();

// ভিজিট ট্র্যাক করার জন্য (POST)
router.post('/track-visit', AnalyticsController.trackVisit);

// ড্যাশবোর্ডের ডাটা পাওয়ার জন্য (GET)
router.get('/stats', AnalyticsController.getTrafficStats);

export const AnalyticsRoutes = router;