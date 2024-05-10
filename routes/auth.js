import express from "express";
import {
  forgotPassword,
  getLoggedInUser,
  getUserProfile,
  logOutUser,
  loginUser,
  registerUser,
  resetPassword,
  updatePassword,
  updateProfile,
  uploadAvatar,
} from "../controllers/authControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logOutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticated, getUserProfile);
router.route("/refresh").get(isAuthenticated, getLoggedInUser);
router.route("/password/update").put(isAuthenticated, updatePassword);
router.route("/me/update").put(isAuthenticated, updateProfile);
router
  .route("/me/upload_avatar")
  .put(isAuthenticated, upload.single("avatar"), uploadAvatar);
export default router;
