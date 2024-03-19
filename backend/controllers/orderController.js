import asyncHandler from 'express-async-handler';
import Restaurant from '../models/restaurantModel.js';
import Table from '../models/tableModel.js';
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

// @desc    gets all orders
// @route   GET /orders/:restaurantId/orders
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

  export {
    getOrders, setOrderInProgress, setOrderPrepared, viewOrderNotes
  };
