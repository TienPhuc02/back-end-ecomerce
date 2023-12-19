import express from "express";
import {
  deleteUsersDetail,
  getAllUser,
  getUserDetails,
  updateUsersDetail,
} from "../controllers/userControllers.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router
  .route("/admin/users")
  .get(isAuthenticated, authorizeRoles("admin"), getAllUser);
router
  .route("/admin/users/:id")
  .get(isAuthenticated, authorizeRoles("admin"), getUserDetails);
router
  .route("/admin/users/:id")
  .put(isAuthenticated, authorizeRoles("admin"), updateUsersDetail);
router
  .route("/admin/users/:id")
  .delete(isAuthenticated, authorizeRoles("admin"), deleteUsersDetail);
export default router;
