import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";
import {
  createNewOrder,
  getMyOrders,
  getOrderDetail,
} from "../controllers/orderController.js";
const router = express.Router();
router.route("/orders/new").post(isAuthenticated, createNewOrder);
router.route("/orders/:id").get(isAuthenticated, getOrderDetail);
router.route("/me/orders").get(isAuthenticated, getMyOrders);
export default router;
