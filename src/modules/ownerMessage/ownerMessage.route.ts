import express from "express";
import { OwnerMessageController } from "./ownerMessage.controller";
import { isAuthenticated } from "../../app/middlewares/auth.middleware";
import { authorizeRoles } from "../../app/middlewares/authorization.middleware";
import { upload } from "../../app/config/cloudinary.config";

const router = express.Router();

// CREATE (with image upload)
router.post(
  "/create",
  isAuthenticated,
  authorizeRoles("admin"),
  upload.single("image"),
  OwnerMessageController.createOwnerMessage,
);

// GET (public)
router.get("/", OwnerMessageController.getOwnerMessage);

// UPDATE (with optional image upload)
router.patch(
  "/update",
  isAuthenticated,
  authorizeRoles("admin"),
  upload.single("image"),
  OwnerMessageController.updateOwnerMessage,
);

// RESET
router.delete(
  "/reset",
  isAuthenticated,
  authorizeRoles("admin"),
  OwnerMessageController.deleteOwnerMessage,
);

export const OwnerMessageRoutes = router;
