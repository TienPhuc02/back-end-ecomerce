import express from "express";
import productRoutes from "./routes/products.js";
import dotenv from "dotenv";
const app = express();
dotenv.config({ path: "./config/config.env" });

///import all routes
app.use("/api/v1", productRoutes);

app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT :${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});
