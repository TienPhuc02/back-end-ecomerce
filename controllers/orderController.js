import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
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
    message: "Get Order Details Success",
    order,
  });
});
