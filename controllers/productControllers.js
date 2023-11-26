import product from "../models/product.js";

//get all product -> /api/v1/products
export const getAllProducts = async (req, res) => {
  res.status(200).json({
    message: "Get All Products Success",
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
