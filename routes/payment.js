import express from "express";
const router = express.Router();

import { isAuthenticated } from "../middlewares/auth.js";
import {
  stripeCheckoutSession,
  stripeWebhook,
} from "../controllers/paymentControllers.js";

router
  .route("/payment/checkout_session")
  .post(isAuthenticated, stripeCheckoutSession);

router.route("/payment/webhook").post(stripeWebhook);

export default router;
