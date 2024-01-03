import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import product from "../models/product.js";
import { APIFilter } from "../utils/apiFilter.js";
import ErrorHandler from "../utils/errorHandler.js";

//get all product -> /api/v1/products
export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const apiFilters = new APIFilter(product, req.query).search().filter();
  console.log(
    "🚀 ~ file: productControllers.js:8 ~ getAllProducts ~ req:",
    req?.user
  );
  let products = await apiFilters.query;
  let filteredProductCount = products.length;
  apiFilters.pagination();
  products = await apiFilters.query.clone();
  res.status(200).json({
    message: "Get All Products Success",
    filteredProductCount,
    products,
  });
});

//create new product -> /api/v1/products
export const createNewProducts = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user._id;
  const newProducts = await product.create(req.body);
  res.status(200).json({
    message: "Create New  Products Success",
    newProducts,
  });
});

//get product details -> /api/v1/products/:id
export const getProductsDetail = catchAsyncErrors(async (req, res, next) => {
  const getProductDetails = await product.findById(req?.params?.id);
  if (!getProductDetails) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    message: "Get  Products Details Success",
    getProductDetails,
  });
});

//update product details -> /api/v1/products/:id
export const updateProductsDetail = catchAsyncErrors(async (req, res, next) => {
  const getProductDetails = await product.findById(req?.params?.id);
  if (!getProductDetails) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const newProductUpdate = await product.findByIdAndUpdate(
    req?.params?.id,
    req.body,
    { new: true }
  );
  res.status(200).json({
    message: "Get  Products Details Success",
    newProductUpdate,
  });
});

//delete product details -> /api/v1/products/:id
export const deleteProductsDetail = catchAsyncErrors(async (req, res, next) => {
  const getProductDetails = await product.findById(req?.params?.id);
  if (!getProductDetails) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await product.deleteOne({ _id: req.params.id });
  res.status(200).json({
    message: "deleted  Products Details Success",
  });
});

//create product review -> /api/v1/products/:id
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { comment, rating, productId } = req.body;
  const review = {
    user: req?.user?._id,
    rating: Number(rating),
    comment,
  };
  const getProductDetails = await product.findById(productId);
  if (!getProductDetails) {
    return next(new ErrorHandler("Product not found", 404));
  }
  const isReviewed = getProductDetails?.reviews?.find((r) => {
    return r.user.toString() === req?.user?._id.toString();
  });
  if (isReviewed) {
    getProductDetails.reviews.forEach((review) => {
      if (review?.user?.toString() === req?.user?._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    getProductDetails.reviews.push(review);
    getProductDetails.numOfReview = getProductDetails.reviews.length;
  }
  getProductDetails.ratings =
    getProductDetails.reviews.reduce((acc, item) => {
      return item.rating + acc;
    }, 0) / getProductDetails.reviews.length;
  await getProductDetails.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

//get product reviews -> /api/v1/products/:id
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const productReviews = await product.findById(req?.query?.id);

  if (!productReviews) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    reviews: productReviews.reviews,
  });
});

//delete product review -> /api/v1/products/:id
export const deleteProductReview = catchAsyncErrors(async (req, res, next) => {
  let deleteProductReviews = await product.findById(req?.query?.productId);
  if (!deleteProductReviews) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = deleteProductReviews?.reviews?.filter((review) => {
    return review._id.toString() !== req?.query?.id.toString();
  });

  const numOfReviews = reviews.length;

  const ratings =
    numOfReviews === 0
      ? 0
      : deleteProductReviews.reviews.reduce((acc, item) => {
          return item.rating + acc;
        }, 0) / numOfReviews;

  deleteProductReviews = await product.findByIdAndUpdate(
    req.query.productId,
    { reviews, numOfReviews, ratings },
    { new: true }
  );

  res.status(200).json({
    success: true,
    deleteProductReviews,
  });
});
