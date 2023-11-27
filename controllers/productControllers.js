import product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";

//get all product -> /api/v1/products
export const getAllProducts = async (req, res) => {
  const allProducts = await product.find();
  res.status(200).json({
    message: "Get All Products Success",
    allProducts,
  });
};

//create new product -> /api/v1/products
export const createNewProducts = async (req, res) => {
  const newProducts = await product.create(req.body);
  res.status(200).json({
    message: "Create New  Products Success",
    newProducts,
  });
};

//get product details -> /api/v1/products/:id
export const getProductsDetail = async (req, res, next) => {
  console.log(req.params);
  const getProductDetails = await product.findById(req?.params?.id);
  if (!getProductDetails) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    message: "Get  Products Details Success",
    getProductDetails,
  });
};

//update product details -> /api/v1/products/:id
export const updateProductsDetail = async (req, res) => {
  console.log(req.params);
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
};

//delete product details -> /api/v1/products/:id
export const deleteProductsDetail = async (req, res) => {
  console.log(req.params);
  const getProductDetails = await product.findById(req?.params?.id);
  if (!getProductDetails) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await product.deleteOne();
  res.status(200).json({
    message: "deleted  Products Details Success",
  });
};
