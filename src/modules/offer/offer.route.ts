import express from "express";
import { OfferController } from "./offer.controller";
import { isAuthenticated } from "../../app/middlewares/auth.middleware";
import { authorizeRoles } from "../../app/middlewares/authorization.middleware";

const router = express.Router();

router.get("/active", OfferController.getActiveOffers);

router.get("/", OfferController.allOffers);

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
router.patch(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  OfferController.updateOffer,
);

export const OfferRoutes = router;
