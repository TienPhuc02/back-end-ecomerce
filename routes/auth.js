import express from "express";
import {
  logOutUser,
  loginUser,
  registerUser,
} from "../controllers/authControllers.js";
const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logOutUser);
export default router;
