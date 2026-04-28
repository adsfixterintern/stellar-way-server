import { Router } from "express";
import { RiderControllers } from "./rider.controller";
import { isAuthenticated } from "../../app/middlewares/auth.middleware";
import { authorizeRoles } from "../../app/middlewares/authorization.middleware";
import { OrderControllers } from "../order/order.controller";

const router = Router();

router.post("/apply-rider",isAuthenticated,authorizeRoles('user'), RiderControllers.applyRider);

router.patch(
  '/update-rating', 
  isAuthenticated, 
  RiderControllers.updateRiderRating
);

router.patch(
  "/approve-rider/:id",
  isAuthenticated,
  authorizeRoles('admin'),
  RiderControllers.approveRider,
);

router.patch("/reject-rider/:id",isAuthenticated,authorizeRoles('admin'), RiderControllers.rejectRider);

router.get(
  "/",
  isAuthenticated,
  authorizeRoles('admin', 'rider', 'user'),
  RiderControllers.getAllRiders,
);


// rider-এর নিজের deliveries
router.get(
  "/rider-deliveries/:riderId",
  isAuthenticated,
  // authorizeRoles("rider", "admin"),
  OrderControllers.getRiderDeliveries,
);

router.get("/rider-stats/:email", OrderControllers.getRiderStatsAndOrders);



router.get("/:id", isAuthenticated, RiderControllers.getSingleRider);

//update rider
router.patch(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin", "rider"),
  RiderControllers.updateRider,
);

router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  RiderControllers.deleteRider,
);

router.get("/my-profile/:userId", isAuthenticated, RiderControllers.getMyRiderProfile);

export const RiderRoutes = router;
