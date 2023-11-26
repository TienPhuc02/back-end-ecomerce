import express from "express";
import productRoutes from "./routes/products.js";
import dotenv from "dotenv";
import { connectDatabase } from "./config/DBconnect.js";
const app = express();
dotenv.config({ path: "./config/config.env" });

//connecting data base
connectDatabase();

app.use(express.json());

//import all routes
app.use("/api/v1", productRoutes);

app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT :${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});
//app ->routes->controller
