import { Router } from 'express';
import { FaqControllers } from './faq.controller';

const router = Router();

router.post('/create-faq', FaqControllers.createFaq);
router.get('/all-faq', FaqControllers.getAllFaqs);
router.get("/faq/:id", FaqControllers.getSingleFaq);
router.put("/faq/:id", FaqControllers.updateFaq);
router.delete("/faq/:id", FaqControllers.deleteFaq);
export const FaqRoutes = router;