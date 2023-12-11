import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Interval Server Error",
  };

  //handle mongo id error
  if (err.name === "CastError") {
    const message = `Resource not found.Invalid ${err?.path}`;
    error = new ErrorHandler(message, 404);
  }

  //handle validation error
  if (err.name === "ValidatorError") {
    const message = Object.values(err.errors).map((value) => value.message);

    error = new ErrorHandler(message, 400);
  }

  //handle mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;

    error = new ErrorHandler(message, 400);
  }

  //handle wrong JWT Error
  if (err.name === "JsonWebTokenError") {
    const message = `JSON Web Token is invalid.Try Again!!!`;

    error = new ErrorHandler(message, 400);
  }
  //handle expried JWT Error
  if (err.name === "JsonExpiredError") {
    const message = `JSON Web Token is expired.Try Again!!!`;

    error = new ErrorHandler(message, 400);
  }

  if (process.env.NODE_ENV.trim() === "DEVELOPMENT") {
    res.status(error.statusCode).json({
      message: error.message,
      error: err,
      stack: err?.stack,
    });
  }
  if (process.env.NODE_ENV.trim() === "PRODUCTION") {
    res.status(error.statusCode).json({
      message: error.message,
    });
  }
};
