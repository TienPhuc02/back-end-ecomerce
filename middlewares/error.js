export default (err, req, res, next) => {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Interval Server Error",
  };
  console.log(process.env.NODE_ENV);
  console.log("error.message", error.message);
  console.log("err", err);
  console.log("err.stack", err.stack);
  console.log(process.env.NODE_ENV.trim() === "DEVELOPMENT");
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
