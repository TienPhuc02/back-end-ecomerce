import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import { upload_file } from "../utils/cloudinary.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendEmail from "../utils/sendEmail.js";
import sendToken from "../utils/sendToken.js";
import crypto from "crypto";
import cloudinary from "cloudinary";
// register user => api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email is already taken. Please choose a different one.",
    });
  }
  const newUser = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "",
      url: "",
    },
  });
  sendToken(newUser, 201, res, "Register User Success");
});

// API endpoint to get user information after reloading
export const getLoggedInUser = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: {
        public_id: req.user.avatar.public_id,
        url: req.user.avatar.url,
      },
    },
  });
});
// login user => api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  //find user in the database
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password", 401));
  }
  // check if password is correct

  const isPasswordMatched = await user.comparePassword(password);
  console.log(
    "🚀 ~ file: authControllers.js:35 ~ loginUser ~ isPasswordMatched:",
    isPasswordMatched
  );
  if (!isPasswordMatched) {
    console.log(
      "🚀 ~ file: authControllers.js:36 ~ loginUser ~ isPasswordMatched:",
      isPasswordMatched
    );
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  sendToken(user, 200, res, "Login User Success");
});

// login user => api/v1/logout
export const logOutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    message: "Logged Out",
  });
});

// upload  user avater => api/v1/me/upload_avatar


export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
  const folder = "SHOPIT/avatars";
  cloudinary.v2.uploader.upload(
    req.file.path,
    { folder: folder },
    async function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Error",
        });
      }
      const user = await User.findByIdAndUpdate(req?.user?._id, {
        avatar: { public_id: result.public_id, url: result.url },
      });
      res.status(200).json({
        success: true,
        message: "Uploaded",
        data: result,
      });
    }
  );
});

// forget user => api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  //find user in the database
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 401));
  }
  // get reset password token

  const resetToken = user.getResetPasswordToken();

  await user.save();

  //create reset password url
  const resetUrl = `${process.env.FRONTEND_URL}/api/password/reset/${resetToken}`;

  const message = getResetPasswordTemplate(user?.name, resetUrl);
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery",
      message,
    });
    res.status(200).json({
      message: `Email sent to ${user?.email}`,
    });
  } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();
    return next(new ErrorHandler(error?.message), 500);
  }
  sendToken(user, 200, res, " Get Forgot User With Token Success");
});

//forgot password -> api/v1/password/reset/:token

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  //hash the  URL token

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Password reset token is invalid or has been expired"),
      400
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match"), 400);
  }
  //set new password
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();
  sendToken(user, 200, res, "Get  Reset Password With Token Success");
});

//get current user profile -> /api/v1/me

export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);
  console.log(user);
  res.status(200).json({
    message: "Get  Update Profile Success",
    user,
  });
});

//update password -> /api/v1/password/update

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  console.log(
    "🚀 ~ file: authControllers.js:139 ~ updatePassword ~ req:",
    req.body
  );
  const user = await User.findById(req?.user?._id).select("+password");
  console.log(
    "🚀 ~ file: authControllers.js:140 ~ updatePassword ~ user:",
    user
  );

  //check previous user password
  const isPasswordMatched = await user.comparePassword(req?.body?.oldPassword);
  console.log(
    "🚀 ~ file: authControllers.js:135 ~ updatePassword ~ isPasswordMatched:",
    isPasswordMatched
  );
  if (!isPasswordMatched) {
    return next(new ErrorHandler("old password is incorrect", 400));
  }
  user.password = req?.body?.password;
  user.save();
  res.status(200).json({
    message: "Get  Update password Success",
    success: true,
  });
});

// update profile -> /api/v1/me/update
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  console.log(
    "🚀 ~ file: authControllers.js:139 ~ updatePassword ~ req:",
    req.body
  );
  const newUserData = {
    email: req.body.email,
    name: req.body.name,
  };
  const user = await User.findByIdAndUpdate(req?.user?._id, newUserData, {
    new: true,
  });
  console.log(
    "🚀 ~ file: authControllers.js:140 ~ updatePassword ~ user:",
    user
  );
  res.status(200).json({
    message: "Get  Update Profile Success",
    user,
  });
});
