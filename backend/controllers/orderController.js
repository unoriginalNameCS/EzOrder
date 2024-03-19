import asyncHandler from 'express-async-handler';
import Restaurant from '../models/restaurantModel.js';
import Table from '../models/tableModel.js';
import Order from '../models/orderModel.js';

// @desc    gets all orders
// @route   GET /orders/:restaurantId/orders
// @access  Public
const getOrders = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params

  const orders = await Order.find({ restaurant : restaurantId })
  if (orders) {
    res.status(201).json({
      orders
    });
  } else {
    res.status(404);
    throw new Error('No Orders')
  }
})

  export {
    getOrders,
  };
