import express from "express";
import {
  createNewProducts,
  deleteProductsDetail,
  getAllProducts,
  getProductsDetail,
  updateProductsDetail,
} from "../controllers/productControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.route("/products").get(isAuthenticated, getAllProducts);
router.route("/admin/products").post(createNewProducts);
router.route("/products/:id").get(getProductsDetail);
router.route("/products/:id").put(updateProductsDetail);
router.route("/products/:id").delete(deleteProductsDetail);
export default router;
