import express from "express";

import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import {
  createNewOrder,
  getAllOrders,
  getMyOrders,
  getOrderDetail,
  updateOrder,
} from "../controllers/orderController.js";
const router = express.Router();
router.route("/orders/new").post(isAuthenticated, createNewOrder);
router.route("/orders/:id").get(isAuthenticated, getOrderDetail);
router.route("/me/orders").get(isAuthenticated, getMyOrders);
router
  .route("/admin/orders")
  .get(isAuthenticated, authorizeRoles("admin"), getAllOrders);
router
  .route("/admin/orders/:id")
  .put(isAuthenticated, authorizeRoles("admin"), updateOrder);
export default router;
