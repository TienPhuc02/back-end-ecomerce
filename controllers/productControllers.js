import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import product from "../models/product.js";
import { APIFilter } from "../utils/apiFilter.js";
import ErrorHandler from "../utils/errorHandler.js";

//get all product -> /api/v1/products
export const getAllProducts = catchAsyncErrors(async (req, res) => {
  const apiFilters = new APIFilter(product, req.query).search().filter();
  const resPerPage = 4;
  let products = await apiFilters.query;
  let filteredProductCount = products.length;
  apiFilters.pagination(resPerPage);
  products = await apiFilters.query.clone();
  res.status(200).json({
    message: "Get All Products Success",
    filteredProductCount,
    products,
  });
});

//create new product -> /api/v1/products
export const createNewProducts = catchAsyncErrors(async (req, res) => {
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
export const updateProductsDetail = catchAsyncErrors(async (req, res) => {
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
export const deleteProductsDetail = catchAsyncErrors(async (req, res) => {
  const getProductDetails = await product.findById(req?.params?.id);
  if (!getProductDetails) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await product.deleteOne();
  res.status(200).json({
    message: "deleted  Products Details Success",
  });
});
