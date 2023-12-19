import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import user from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";

//get all user -> /api/v1/admin/users
export const getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await user.find().search().filter();
  res.status(200).json({
    message: "Get All  User Details Success",
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
    message: "Get  User Details Success",
    user: foundUser,
  });
});

//update product details -> /api/v1/users/:id
export const updateUsersDetail = catchAsyncErrors(async (req, res) => {
  const getUserDetails = await user.findById(req?.params?.id);
  if (!getUserDetails) {
    return next(new ErrorHandler("Product not found", 404));
  }
  const newUserData = {
    email: req.body.email,
    name: req.body.name,
    role: req.body.role,
  };
//   console.log("🚀 ~ file: userControllers.js:44 ~ updateUsersDetail ~ newUserData:", newUserData)

  const newUserUpdate = await user.findByIdAndUpdate(
    req?.params?.id,
    newUserData,
    { new: true }
  );
  res.status(200).json({
    message: "Get Users Details Success",
    newUserUpdate,
  });
});

//delete user details -> /api/v1/users/:id
export const deleteUsersDetail = catchAsyncErrors(async (req, res) => {
  const getUserDetails = await user.findById(req?.params?.id);
  if (!getUserDetails) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await user.deleteOne({ _id: req.params.id });
  res.status(200).json({
    message: "deleted User Details Success",
  });
});
