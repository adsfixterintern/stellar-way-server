import express from "express";
import { SettingsController } from "./settings.controller";
import { isAuthenticated } from "../../app/middlewares/auth.middleware";
import { authorizeRoles } from "../../app/middlewares/authorization.middleware";
import { upload } from "../../app/config/cloudinary.config";

const router = express.Router();

router.get("/", SettingsController.getSettings);
router.patch(
  "/update",
  isAuthenticated,
  authorizeRoles("admin"),
  upload.single('logo'),
  SettingsController.updateSettings,
);

export const SettingsRoutes = router;
