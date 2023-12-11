import express from "express";
import {
  forgotPassword,
  logOutUser,
  loginUser,
  registerUser,
} from "../controllers/authControllers.js";
const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logOutUser);
router.route("/password/forgot").post(forgotPassword);
export default router;
