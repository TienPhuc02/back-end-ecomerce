import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import product from "../models/product.js";

import APIFilters from "../utils/apiFilter.js";
import ErrorHandler from "../utils/errorHandler.js";

//get all product -> /api/v1/products
export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const apiFilters = new APIFilters(product, req.query)
    ?.search()
    ?.filters()
    ?.pagination();
  console.log("hehehe", apiFilters);
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
  const getProductDetails = await product
    .findById(req?.params?.id)
    .populate("reviews.user");
  if (!getProductDetails) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    message: "Get  Products Details Success",
    getProductDetails,
  });
});
// Get products - ADMIN   =>  /api/v1/admin/products
export const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    products,
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
// Upload product images   =>  /api/v1/admin/products/:id/upload_images
export const uploadProductImages = catchAsyncErrors(async (req, res) => {
  let productFind = await product.findById(req?.params?.id);

  if (!productFind) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const uploader = async (image) => upload_file(image, "shopit/products");

  const urls = await Promise.all((req?.body?.images).map(uploader));

  product?.images?.push(...urls);
  await product?.save();

  res.status(200).json({
    product,
  });
});

// Delete product image   =>  /api/v1/admin/products/:id/delete_image
export const deleteProductImage = catchAsyncErrors(async (req, res) => {
  let productFind = await product.findById(req?.params?.id);

  if (!productFind) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const isDeleted = await delete_file(req.body.imgId);

  if (isDeleted) {
    product.images = product?.images?.filter(
      (img) => img.public_id !== req.body.imgId
    );

    await product?.save();
  }

  res.status(200).json({
    product,
  });
});
//delete product details -> /api/v1/products/:id
export const deleteProductsDetail = catchAsyncErrors(async (req, res, next) => {
  const getProductDetails = await product
    .findById(req?.params?.id)
    .populate("reviews.user");
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

// Get product reviews   =>  /api/v1/reviews
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
// Can user review   =>  /api/v1/can_review
export const canUserReview = catchAsyncErrors(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
    "orderItems.product": req.query.productId,
  });

  if (orders.length === 0) {
    return res.status(200).json({ canReview: false });
  }

  res.status(200).json({
    canReview: true,
  });
});
