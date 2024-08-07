import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import product from "../models/product.js";
import user from "../models/user.js";
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

  // Cập nhật số lượng tồn kho của sản phẩm
  for (const item of orderItems) {
    const productFind = await product.findById(item.product);
    if (!productFind) {
      return next(new ErrorHandler("No product found with this ID", 404));
    }
    productFind.stock -= item.quantity;
    await productFind.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    message: "Create Order Success!!",
    order,
  });
});

//get current user orders  -> api/v1/me/orders
export const getMyOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })
    .populate({
      path: "user",
      select: "name email",
    })
    .populate({
      path: "orderItems.product",
      model: product,
    });

  if (!orders || orders.length === 0) {
    return next(new ErrorHandler("No order found with this ID", 404));
  }
  res.status(200).json({
    message: "Get Order Details User Success",
    orders,
  });
});

//get  order details  -> api/v1/orders/:id
export const getOrderDetail = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: "user",
      model: user,
    })
    .populate({
      path: "orderItems.product",
      model: product,
    });
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
  const order = await Order.find()
    .populate({
      path: "user",
      model: user,
    })
    .populate({
      path: "orderItems.product",
      model: product,
    });
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
    const productUpdate = await product.findById(item?.product?.toString());
    if (!productUpdate) {
      return next(new ErrorHandler("No product found with this ID", 404));
    }
    productUpdate.stock = productUpdate.stock - item.quantity;
    await productUpdate.save({ validateBeforeSave: false });
  });
  order.orderStatus = req.body.orderStatus;
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
// Get Sales Data  =>  /api/v1/admin/get_sales
export const getSales = catchAsyncErrors(async (req, res, next) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  const { salesData, totalSales, totalNumOrders } = await getSalesData(
    startDate,
    endDate
  );

  res.status(200).json({
    totalSales,
    totalNumOrders,
    sales: salesData,
  });
});
