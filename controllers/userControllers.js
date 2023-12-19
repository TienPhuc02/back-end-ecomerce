import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import user from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";

//get all user -> /api/v1/admin/users
export const getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await user.find();
  res.status(200).json({
    users,
  });
});

//get user  details -> /api/v1/admin/user/:id
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const foundUser = await user.findById(req?.params?.id);
  console.log(
    "🚀 ~ file: userControllers.js:16 ~ getUserDetails ~ user:",
    foundUser
  );

  if (!foundUser) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params._id}`, 404)
    );
  }
  res.status(200).json({
    user: foundUser,
  });
});
