import express from "express";
import productRoutes from "./routes/products.js";
import dotenv from "dotenv";
import { connectDatabase } from "./config/DBconnect.js";
import errorMiddleware from "./middlewares/error.js";
const app = express();
dotenv.config({ path: "./config/config.env" });

//connecting data base
connectDatabase();

app.use(express.json());

//import all routes
app.use("/api/v1", productRoutes);

// using error middleware
app.use(errorMiddleware); // phải để ở dưới này

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT :${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});
//app ->routes->controller

//handle unhandle promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("shutting down  server due to  unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
