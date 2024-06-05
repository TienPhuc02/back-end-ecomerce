import mongoose from "mongoose";
import product from "../models/product.js";
import { Products } from "./data.js";
// import order from "../models/order.js";

const seedProducts = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://dtp2352002:TdcmY1xtZizRpXfi@cluster0.d6wxpw5.mongodb.net/phucDB"
    );
    await product.insertMany(Products);
    console.log("Product is added");
    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};
seedProducts();
