import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";
import { createNewOrder } from "../controllers/orderController.js";
const router = express.Router();
router.route("/orders/new").post(isAuthenticated,createNewOrder );
export default router;
