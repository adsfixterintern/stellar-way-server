import { Router } from "express";
import { FeedbackControllers } from "./feedback.controller";
import { upload } from "../../app/config/cloudinary.config";
import { isAuthenticated } from "../../app/middlewares/auth.middleware";
import { authorizeRoles } from "../../app/middlewares/authorization.middleware";

const router = Router();

router.post(
  "/create-feedback",
  upload.single("image"),
  isAuthenticated,
  authorizeRoles("admin", "user", "chef", "rider"),
  FeedbackControllers.createFeedback,
);
router.get("/all-feedback",isAuthenticated,authorizeRoles('admin','user','chef','rider'), FeedbackControllers.getAllFeedbacks);
router.patch("/:id",isAuthenticated,authorizeRoles('admin','user'), FeedbackControllers.updateFeedback);

router.get("/my-feedbacks", isAuthenticated, FeedbackControllers.getMyFeedbacks);
router.delete("/:id", isAuthenticated, authorizeRoles('admin', 'user'), FeedbackControllers.deleteFeedback);

export const FeedbackRoutes = router;
