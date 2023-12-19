import express from "express";
import { getAllUser, getUserDetails } from "../controllers/userControllers.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router
  .route("/admin/users")
  .get(isAuthenticated, authorizeRoles("admin"), getAllUser);
router
  .route("/admin/user/:id")
  .get(isAuthenticated, authorizeRoles("admin"), getUserDetails);
export default router;
