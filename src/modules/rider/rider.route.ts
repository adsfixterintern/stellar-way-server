import { Router } from "express";
import { RiderControllers } from "./rider.controller";
import { isAuthenticated } from "../../app/middlewares/auth.middleware";
import { authorizeRoles } from "../../app/middlewares/authorization.middleware";

const router = Router();

router.post("/apply-rider", RiderControllers.applyRider);

router.patch(
  '/update-rating', 
  isAuthenticated, 
  RiderControllers.updateRiderRating
);

router.patch(
  "/approve-rider/:id",
  // isAuthenticated,
  // authorizeRoles('admin'),
  RiderControllers.approveRider,
);

router.patch("/reject-rider/:id", RiderControllers.rejectRider);

router.get(
  "/",
  // isAuthenticated,
  // authorizeRoles('admin'),
  RiderControllers.getAllRiders,
);

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
  // isAuthenticated,
  // authorizeRoles("admin"),
  RiderControllers.deleteRider,
);


export const RiderRoutes = router;
