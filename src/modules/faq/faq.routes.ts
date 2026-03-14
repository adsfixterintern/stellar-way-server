import express from "express";
import { FaqControllers } from "./faq.controller";

const router = express.Router();

router.post("/create-faq", FaqControllers.createFaq);

export const FaqRoutes = router;