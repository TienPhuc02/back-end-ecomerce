import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import user from "../models/user.js";
import APIFilters from "../utils/apiFilter.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";
//get all user -> /api/v1/admin/users
export const getAllUser = catchAsyncErrors(async (req, res, next) => {
  const queryStr = { ...req.query };
  const { name, email } = req.query;

  if (name) {
    queryStr.keyword = name;
    delete queryStr.name;
  } else if (email) {
    queryStr.keyword = email;
    delete queryStr.email;
  }

  const apiFilters = new APIFilters(user, queryStr)?.search()?.filters();

  let users = await apiFilters.query;
  let filteredProductCount = users.length;
  apiFilters.pagination();
  users = await apiFilters.query.clone();

  res.status(200).json({
    message: "Get All Products Success",
    filteredProductCount,
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

export const createNewUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, role, password } = req.body;

  // Kiểm tra trùng tên
  let existingUser = await user.findOne({ name });
  if (existingUser) {
    return next(new ErrorHandler("Tên người dùng đã tồn tại", 400));
  }

  // Kiểm tra trùng email
  existingUser = await user.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("Email đã tồn tại", 400));
  }

  // Upload avatar lên Cloudinary
  const result = await cloudinary.v2.uploader.upload(req.file.path, {
    folder: "SHOPIT/avatars",
  });

  // Tạo người dùng mới
  const newUser = await user.create({
    name,
    email,
    role,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });

  res.status(200).json({
    message: "Create New User with Avatar Success",
    newUser,
  });
});
