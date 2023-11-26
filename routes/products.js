import express from "express";
import {
  createNewProducts,
  getAllProducts,
} from "../controllers/productControllers.js";
const router = express.Router();
router.route("/products").get(getAllProducts);
router.route("/admin/products").post(createNewProducts);
export default router;
