const asyncHandler = require('express-async-handler');
const { Order } = require('../Model/OrderModel');

//@desc Save Order to database
//@route POST /api/orders
//@access private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentResult,
  } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order Items');
    return;
  } else {
    const order = new Order({
      orderItems,
      shippingAddress,
      paymentMethod,
      user: req.user._id,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: Date.now(),
      paymentresult: {
        id: paymentResult.id,
        status: paymentResult.status,
        update_time: paymentResult.update_time,
        email_address: paymentResult.payer.email_address,
      },
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

//@desc Get order by id
//@route GET /api/orders/:id
//@access private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

//@desc Update order payment
//@route PUT /api/orders/:id/pay
//@access private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    (order.isPaid = true),
      (order.paidAt = Date.now()),
      (order.paymentresult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      });

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

//@desc Get loggedin users orders
//@route GET /api/orders/myorders
//@access private
const getLoggedInUsersOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

//#######ADMIN###########ADMIN#####ADMIN###############ADMIN##########ADMIN#########ADMIN#############ADMIN######

//@desc Get  all orders
//@route GET /api/orders?pageNumber
//@access private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const orders = await Order.find({})
    .populate('user', 'name')
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  const count = await Order.countDocuments({});
  // console.log(count);
  res.json({ orders, page, pages: Math.ceil(count / pageSize) });
});

//@desc Get  all orders
//@route GET /api/orders?pageNumber
//@access private/Admin
const updateOrderAdmin = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  const { isPaid, isDelivered } = req.body;
  if (order) {
    order.isPaid = isPaid;
    order.isDelivered = isDelivered;
    order.save();
    res.status(200).json({ message: 'success' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = {
  updateOrderAdmin,
  getAllOrders,
  getOrderById,
  getLoggedInUsersOrders,
  updateOrderToPaid,
  createOrder,
};
