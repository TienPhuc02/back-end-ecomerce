import express from "express";
import cors from "cors";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";
import dotenv from "dotenv";
import { connectDatabase } from "./config/DBconnect.js";
import errorMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
const app = express();
app.use(express.json());
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("shutting down  server due to  uncaught expection");
  process.exit(1);
});
dotenv.config();

//connecting data base
connectDatabase();

app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
//cookie-parser
app.use(cookieParser());

// use cors middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

//import all routes
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

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
