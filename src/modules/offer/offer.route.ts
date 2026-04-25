import express from "express";
import { OfferController } from "./offer.controller";
import { isAuthenticated } from "../../app/middlewares/auth.middleware";
import { authorizeRoles } from "../../app/middlewares/authorization.middleware";

const router = express.Router();

router.get("/active", OfferController.getActiveOffers);

router.post(
  "/create",
  isAuthenticated,
  authorizeRoles("admin"),
  OfferController.createOffer,
);

router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  OfferController.deleteOffer,
);

export const OfferRoutes = router;
