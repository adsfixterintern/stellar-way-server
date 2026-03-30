import express from "express";
import { UserController } from "./user.controller";
import { isAuthenticated } from "../../app/middlewares/auth.middleware";
import { authorizeRoles } from "../../app/middlewares/authorization.middleware";

const router = express.Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.post("/logout", UserController.logoutUser);

router.get(
  "/admin-dashboard",
  isAuthenticated,
  authorizeRoles("admin"),
  UserController.getAdminData,
);

router.patch("/update-profile", isAuthenticated, UserController.updateProfile);

router.post("/forget-password", UserController.forgetPassword);
router.patch("/reset-password/:token", UserController.resetPassword);
router.patch(
  "/change-password",
  isAuthenticated,
  UserController.changePassword,
);

router.post("/forget-password", UserController.forgetPassword);
router.patch("/reset-password/:token", UserController.resetPassword);
router.patch(
  "/change-password",
  isAuthenticated,
  UserController.changePassword,
);

router.get(
  "/all-users",
  isAuthenticated,
  authorizeRoles("admin"),
  UserController.getAllUsers,
);

router.delete(
  "/user/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  UserController.deleteUser,
);
router.patch(
  "/users/update-role/:id",
  UserController.updateUserRole
);

export const UserRoutes = router;
