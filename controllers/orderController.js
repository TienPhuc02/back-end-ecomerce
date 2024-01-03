import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";

//create a new order  -> api/v1/orders/new

export const createNewOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;
  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    user: req.user._id,
  });

  res.status(200).json({
    message: "Create Order Success!!",
    order,
  });
});

//get current user orders  -> api/v1/me/orders
export const getMyOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  if (!orders) {
    return next(new ErrorHandler("No order found with this ID", 404));
  }
  res.status(200).json({
    message: "Get Order Details User Success",
    orders,
  });
});

//get  order details  -> api/v1/orders/:id
export const getOrderDetail = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("No order found with this ID", 404));
  }
  res.status(200).json({
    message: "Get All Order  Success",
    order,
  });
});

//get  all order -ADMIN   -> api/v1/admin/orders
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.find();
  if (!order) {
    return next(new ErrorHandler("No order found with this ID", 404));
  }
  res.status(200).json({
    message: "Get Order Details Success",
    order,
  });
});
//update order -ADMIN   -> api/v1/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("No order found with this ID", 404));
  }
  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHandler("You have  already  delivered this order", 404)
    );
  }
  order?.orderItems?.forEach(async (item) => {
    const product = await Product.findById(item?.product?.toString());
    if (!product) {
      return next(new ErrorHandler("No product found with this ID", 404));
    }
    product.stock = product.stock - item.quantity;
    await product.save({ validateBeforeSave: false });
  });
  order.orderStatus = req.body.status;
  order.deliverAt = Date.now();
  await order.save();
  res.status(200).json({
    message: "Update Order Detail Success",
    success: true,
  });
});

//delete order -ADMIN   -> api/v1/admin/orders
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.deleteOne(req.param.id);
  if (!order) {
    return next(new ErrorHandler("No order found with this ID", 404));
  }
  res.status(200).json({
    message: "Delete Order Detail Success",
    success: true,
  });
});
