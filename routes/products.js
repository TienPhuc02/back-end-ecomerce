import express from "express";
import {
  createNewProducts,
  getAllProducts,
  getProductsDetail,
} from "../controllers/productControllers.js";
const router = express.Router();
router.route("/products").get(getAllProducts);
router.route("/admin/products").post(createNewProducts);
router.route("/products/:id").get(getProductsDetail);
export default router;
