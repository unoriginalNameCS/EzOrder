import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

/**
 * @desc    Gets all orders in a certain state
 * @route   GET /orders/:restaurantId/orders
 * @access  Public
 * @param req.params.restaurantId - id of the restaurant
 * @param req.query.state - state of orders to return
 * @param req.query.isWaiter - is the user a waiter
 * @returns {List: [Order]}
 */
const getOrders = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { state, isWaiter } = req.query;

  const timeType = isWaiter ? 'serveTime' : '-time';

  const orders = await Order.find({ restaurant : restaurantId, state: state }).sort(timeType);

  // Populate each order with detailed information
  const populatedOrders = await Promise.all(
    orders.map(async (order) => {
      const populatedOrder = await Order.findOne({ _id: order._id, restaurant: restaurantId}).populate({
        path: 'items',
        model: 'CartItem',
        populate: { path: 'menuItem', model: 'MenuItem' },
      });
      // Calculate total quantity for the order
      let totalQuantity = 0;
      populatedOrder.items.forEach((cartItem) => {
        totalQuantity += cartItem.quantity;
      });
      return { order: populatedOrder, totalQuantity };
    })
  );
  if (populatedOrders) {
    res.status(200).json(populatedOrders);  
  } else {
    res.status(204).json(populatedOrders);
  }
})

/**
 * @desc    Set the order to preparing from pending
 * @route   PUT /orders/:restaurantId/:orderId/inProgress
 * @access  Public
 * @param req.params.orderId - id of the order
 * @returns {Order}
 */
const setOrderInProgress = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

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

/**
 * @desc    Set the order to serve from preparing
 * @route   PUT /orders/:restaurantId/:orderId/prepared
 * @access  Public
 * @param req.params.orderId - id of the order
 * @returns {Order}
 */
const setOrderPrepared = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

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
  order.serveTime = new Date();
  await order.save();
  res.status(201).json(order);
})

/**
 * @desc    Set the order to serving from serve
 * @route   PUT /orders/:restaurantId/:orderId/serving
 * @access  Public
 * @param req.params.orderId - id of the order
 * @returns {Order}
 */
const setOrderServing = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findOne({_id: orderId});
  if (!order) {
    res.status(404);
    throw new Error('No order found');
  }
  if (order.state != "serve") {
    res.status(400);
    throw new Error('Order is not served');
  }
  order.state = "serving";
  await order.save();
  res.status(201).json(order);
})

/**
 * @desc    Set the order to served from serving
 * @route   PUT /orders/:restaurantId/:orderId/served
 * @access  Public
 * @param req.params.orderId - id of the order
 * @returns {Order}
 */
const setOrderServed = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findOne({_id: orderId});
  if (!order) {
    res.status(404);
    throw new Error('No order found');
  }
  if (order.state != "serving") {
    res.status(400);
    throw new Error('Order is not being served');
  }
  order.state = "served";
  await order.save();
  res.status(201).json(order);
})

export { getOrders, setOrderInProgress, setOrderPrepared, setOrderServed, setOrderServing };

