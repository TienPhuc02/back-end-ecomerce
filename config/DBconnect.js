import mongoose from "mongoose";
export const connectDatabase = () => {
  let DB_URI = process.env.DB_URI;
  if (process.env.NODE_ENV === "DEVELOPMENT")
    DB_URI = process.env.NODE_ENV = DB_URI;
  if (process.env.NODE_ENV === "PRODUCTION")
    DB_URI = process.env.NODE_ENV = DB_URI;
  mongoose
    .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((con) => {
      console.log(`Mongoose DB connected with HOST : ${con?.connection?.host}`);
    });
};
