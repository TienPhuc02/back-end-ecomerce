import express from "express";
import {
  createNewProducts,
  deleteProductsDetail,
  getAllProducts,
  getProductsDetail,
  updateProductsDetail,
} from "../controllers/productControllers.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.route("/products").get(getAllProducts);
router
  .route("/admin/products")
  .post(isAuthenticated, authorizeRoles("admin"), createNewProducts);
router.route("/products/:id").get(getProductsDetail);
router
  .route("/admin/products/:id")
  .put(isAuthenticated, authorizeRoles("admin"), updateProductsDetail);
router
  .route("/admin/products/:id")
  .delete(isAuthenticated, authorizeRoles("admin"), deleteProductsDetail);
export default router;
