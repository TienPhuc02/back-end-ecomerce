import express from "express";
import {
  canUserReview,
  createNewProducts,
  createProductReview,
  deleteProductImage,
  deleteProductReview,
  deleteProductsDetail,
  getAdminProducts,
  getAllProducts,
  getProductReviews,
  getProductsDetail,
  updateProductsDetail,
  uploadProductImages,
} from "../controllers/productControllers.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
const router = express.Router();
router.route("/products").get(getAllProducts);
router
  .route("/admin/products")
  .post(
    isAuthenticated,
    authorizeRoles("admin"),
    upload.array("images", 10),
    createNewProducts
  )
  .get(isAuthenticated, authorizeRoles("admin"), getAdminProducts);
router.route("/products/:id").get(getProductsDetail);
router
  .route("/admin/products/:id")
  .put(isAuthenticated, authorizeRoles("admin"), upload.array("images", 10), updateProductsDetail);
router
  .route("/admin/products/:id")
  .delete(isAuthenticated, authorizeRoles("admin"), deleteProductsDetail);
router
  .route("/reviews")
  .put(isAuthenticated, createProductReview)
  .get(isAuthenticated, getProductReviews);
router
  .route("/admin/reviews")
  .delete(isAuthenticated, authorizeRoles("admin"), deleteProductReview);
router
  .route("/admin/products/:id/upload_images")
  .put(isAuthenticated, authorizeRoles("admin"), uploadProductImages);
router
  .route("/admin/products/:id/delete_image")
  .put(isAuthenticated, authorizeRoles("admin"), deleteProductImage);
router.route("/can_review").get(isAuthenticated, canUserReview);
export default router;
