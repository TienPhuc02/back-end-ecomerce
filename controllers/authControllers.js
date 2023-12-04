import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";

export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
  });
  const token = newUser.getJwtToken();
  res.status(201).json({
    success: true,
    token,
  });
});
