import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  console.log("🚀 ~ file: auth.js:7 ~ isAuthenticated ~ token:", token);
  if (!token) {
    return next(new ErrorHandler("Login first to access this resource", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  console.log("🚀 ~ file: auth.js:13 ~ isAuthenticated ~ decoded:", decoded);
  req.user = await User.findById(decoded.id);
  next();
});

// Authorize user roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role ${req.user.role} is not allowed to access this resource`,
          401
        )
      );
    }
    next();
  };
};
