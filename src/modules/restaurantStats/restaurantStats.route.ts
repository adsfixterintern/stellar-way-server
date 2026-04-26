import express from "express";
import { RestaurantStatsController } from "./restaurantStats.controller";
import { isAuthenticated } from "../../app/middlewares/auth.middleware";
import { authorizeRoles } from "../../app/middlewares/authorization.middleware";

const router = express.Router();

router.post(
  "/create",
  isAuthenticated,
  authorizeRoles("admin"),
  RestaurantStatsController.createStats,
);
router.get("/", RestaurantStatsController.getStats);
router.patch(
  "/update",
  isAuthenticated,
  authorizeRoles("admin"),
  RestaurantStatsController.updateStats,
);
router.delete(
  "/reset",
  isAuthenticated,
  authorizeRoles("admin"),
  RestaurantStatsController.deleteStats,
);

export const RestaurantStatsRoutes = router;
