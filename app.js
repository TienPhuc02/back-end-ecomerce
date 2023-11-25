import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
app.listen(process.env.PORT, () => {
  console.log(`Server started on PORT :${process.env.PORT} `);
});
