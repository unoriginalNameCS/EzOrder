import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

// @desc    gets all orders
// @route   GET /orders/:restaurantId/orders
// @access  Public
const getOrders = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params

  const orders = await Order.find({ restaurant : restaurantId }).sort('time');
  if (orders) {
    res.status(201).json({
      orders
    });
  } else {
    res.status(404);
    throw new Error('No Orders')
  }
})

// @desc    set order in progress
// @route   PUT /:restaurantId/:orderId/inProgress
// @access  Public
const setOrderInProgress = asyncHandler(async (req, res) => {
  const { restaurantId, orderId } = req.params;

  const order = await Order.findOne({_id: orderId});
  if (!order) {
    res.status(404);
    throw new Error('No order found');
  }
  if (order.state != "pending") {
    res.status(400);
    throw new Error('Order is not pending');
  }
  order.state = "preparing";
  await order.save();
  res.status(201).json(order);
})


// @desc    set order prepared
// @route   PUT /:restaurantId/:orderId/prepared
// @access  Public
const setOrderPrepared = asyncHandler(async (req, res) => {
  const { restaurantId, orderId } = req.params;

  const order = await Order.findOne({_id: orderId});
  if (!order) {
    res.status(404);
    throw new Error('No order found');
  }
  if (order.state != "preparing") {
    res.status(400);
    throw new Error('Order is not preparing');
  }
  order.state = "serve";
  await order.save();
  res.status(201).json(order);
})

const viewOrderNotes = asyncHandler(async (req, res) => {
  const { restaurantId, orderId } = req.params;

  const order = await Order.findOne({_id: orderId});
  if (!order) {
    res.status(404);
    throw new Error('No order found');
  }
  res.status(201).json(order.notes);
})

// @desc    gets all completed orders
// @route   GET /orders/:restaurantId/completedOrders
// @access  Public
const getCompletedOrders = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  const completedOrders = await Order.find({ restaurant : restaurantId, state: "serve" } ).sort('time');
  if (completedOrders) {
    res.status(201).json(completedOrders);
  } else {
    res.status(404);
    throw new Error('No Ready To Serve Orders')
  }
})

// @desc    gets all completed orders
// @route   GET /orders/:restaurantId/preparingOrders
// @access  Public
const getPreparingOrders = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  const preparingOrders = await Order.find({ restaurant : restaurantId, state: "preparing" } ).sort('time');
  if (preparingOrders) {
    res.status(201).json(preparingOrders);
  } else {
    res.status(404);
    throw new Error('No Orders Being Prepared')
  }
})

// @desc    gets all completed orders
// @route   GET /orders/:restaurantId/pendingOrders
// @access  Public
const getPendingOrders = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  const pendingOrders = await Order.find({ restaurant : restaurantId, state: "pending" }).sort('time');
  if (pendingOrders) {
    res.status(201).json(pendingOrders);
  } else {
    res.status(404);
    throw new Error('No Orders Are Pending')
  }
})

export { getCompletedOrders, getOrders, getPendingOrders, getPreparingOrders, setOrderInProgress, setOrderPrepared, viewOrderNotes };

