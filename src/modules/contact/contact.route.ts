import express from "express";
import { ContactController } from "./contact.controller";
import { isAuthenticated } from "../../app/middlewares/auth.middleware";
import { authorizeRoles } from "../../app/middlewares/authorization.middleware";

const router = express.Router();

router.post("/send", ContactController.createContactMessage);

router.get(
  "/all-messages",
  isAuthenticated,
  authorizeRoles("admin"),
  ContactController.getAllMessages,
);

router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  ContactController.deleteMessage,
);

export const ContactRoutes = router;
