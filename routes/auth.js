import express from "express";
import {
  forgotPassword,
  getUserProfile,
  logOutUser,
  loginUser,
  registerUser,
  resetPassword,
} from "../controllers/authControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logOutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/me").get(isAuthenticated, getUserProfile);
router.route("/password/reset/:token").put(resetPassword);
export default router;
