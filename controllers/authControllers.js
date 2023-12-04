import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import user from "../models/user.js";

export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const newUser = user.create({
    name,
    email,
    password,
  });
  res.status(201).json({
    success: true,
  });
});
