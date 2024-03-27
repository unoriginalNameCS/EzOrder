import asyncHandler from 'express-async-handler';
import MenuItem from '../models/itemModel.js';
import Order from '../models/orderModel.js';
import Request from '../models/requestModel.js';
import Restaurant from '../models/restaurantModel.js';
import Table from '../models/tableModel.js';

// @desc    Sets a table status to occupied
// @route   POST /tables/:restaurantId/select
// @access  Public
const tableSelect = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { tableNumber } = req.body;
  
  const table = await Table.findOne({ number:tableNumber, restaurant : restaurantId });
  //check if table is occupied
  // changed error code to 400 from 401 as 401 is unauthorised
  if (table.occupied) {
    res.status(400);
    throw new Error('Table is occupied');
  } else {
    // set table occupied to true now that its being selected
    table.occupied = true
    // save the updated table in the database
    const updatedTable = await table.save();
    res.status(200).json(updatedTable);
  }
});

// @desc    gets all table numbers
// @route   GET /tables/:restaurantId/numbers
// @access  Public
const getTableNumbers = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params

  // changed query to include occupied field as well
  const tableNumbers = await Table.find({ restaurant : restaurantId }).select('number occupied')
  if (tableNumbers) {
    // changed status code from 201 to 200
    // removed unecessary object encapsulating tableNumbers
    res.status(200).json(
      tableNumbers);
  } else {
    res.status(404);
    throw new Error('Tables not found')
  }
  
})

// @desc  add table
// @route  POST /tables/:restaurantId/add
// @access Public
const addTable = asyncHandler(async (req, res) => {
  const { number } = req.body;
  
  // search db for restaurant
  const { restaurantId } = req.params;
  const restaurant = await Restaurant.findOne( { _id: restaurantId });
  if (!restaurant) {
    res.status(400);
    throw new Error(
      `Restaurant don't exist.`
    );
  }

  const table = await Table.create({
    number,
    restaurant,
    occupied: false,
  });

  if (table) {
    res.json(table);
  } else {
    res.status(404);
    throw new Error('Invalid restaurant data');
  }
})

// @desc    adds request to database for assistance
// @route   POST /tables/:restaurantId/:tableId/assistance
// @access  Public
const requestAssistance = asyncHandler(async (req, res) => {
  const { restaurantId, tableId } = req.params
  const { requestedBill } = req.body
  
  const table = await Table.findById(tableId)
  if (!table) {
    res.status(404);
    throw new Error('Table not found')
  }

  const restaurant = await Restaurant.findById(restaurantId)
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found')
  }

  const request = await Request.create({
    restaurant: restaurantId,
    state: 'pending',
    tableNum: table.number,
    requestedBill: requestedBill
  });

  if (request) {
    res.status(201).json(request);
  } else {
      res.status(400);
      throw new Error('invalid');
  }
})

// @desc    sendOrder
// @route   POST /orders/:restaurantId/:tableId/sendOrder
// @access  Public
const sendOrder = asyncHandler(async (req, res) => {
  const { restaurantId, tableId } = req.params
  const { notes } = req.body
  
  const table = await Table.findById(tableId)
  if (!table) {
    res.status(404);
    throw new Error('Table not found')
  }

  const restaurant = await Restaurant.findById(restaurantId)
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found')
  }

  // if (table.cart.length == 0) {
  //   res.status(400);
  //   throw new Error('Cannot send an order with an empty cart')
  // }

  const order = await Order.create({
    restaurant: restaurantId,
    tableNum: table.number,
    items: table.cart,
    time: new Date(),
    notes,
    state: "pending"
  });

  if (order) {

    // Empties the cart
    table.cart = [];
    await table.save();

    res.status(201).json(order);
  } else {
      res.status(400);
      throw new Error('invalid');
  }
})

// @desc    Returns a list of pending requests for assistance for the given restaurant
// @params  body: restaurantId - the objectId of the restaurant that the waiter is employed at
// @route   GET restaurantId/assistance
// @access  Private
const getPendingRequestsForAssistance = asyncHandler(async (req, res) => {
  // search for requests with restaurantId
  const restaurant = req.params.restaurantId
  // for given restaurantId and state has to equal 'pending'
  const requests = await Request.find({restaurant: restaurant, state: 'pending', })
  // no requests found for the given restaurant
  if (!requests) {
    // send empty array
    res.status(204).json(requests)
  } else {
    // at least one request found
    res.status(200).json(requests)
  }
})

// @desc    Change state of request
// @route   PATCH /tables/assistanc
// @params  body: state - 'assisting' or 'complete'
// @params  body: _id - the id of the request in MongoDB
// @access  Private
const updateRequestsForAssistance = asyncHandler(async (req, res) => {
  const request_id = req.body.request_id
  const state = req.body.state
  // search db for particular request with _id
  const request = await Request.findById(request_id)
  if (!request) {
    // can't find the request for assistance in the db, something went wrong
    res.status(404)
    throw new Error('Something went wrong, could not find the Request For Assistance')
  } else {
    // found the particular request in the db
    request.state = state // update state
    const updatedRequest = await request.save();
    res.status(200).json(updatedRequest)
  }
})


// @desc    adds item to table cart
// @route   POST /tables/:restaurantId/:tableId/:itemId/addItem
// @access  Public
const addItem = asyncHandler(async (req, res) => {
  const { restaurantId, tableId, itemId } = req.params;
  const { notes, quantity } = req.body; // Assuming these are passed in the request body

  try {
    // Find the table by ID and restaurant
    const table = await Table.findOne({ _id: tableId, restaurant: restaurantId });

    if (!table) {
      res.status(404);
      throw new Error('Table not found');
    }

    // Assuming you have a MenuItem model and want to add it to the cart
    const menuItem = await MenuItem.findById(itemId);

    if (!menuItem) {
      res.status(404);
      throw new Error('Menu item not found');
    }

    // Add the item to the cart
    table.cart.push({
      menuItem: itemId,
      notes,
      quantity,
    });

    // Save the updated table
    await table.save();

    res.status(200).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Removes an item from the table cart
// @route   DELETE /tables/:restaurantId/:tableId/:cartItemId/removeItem
// @access  Public
const removeItem = asyncHandler(async (req, res) => {
  const { restaurantId, tableId, cartItemId } = req.params;

  try {
    // Find the table by ID and restaurant
    const table = await Table.findOne({ _id: tableId, restaurant: restaurantId });

    if (!table) {
      res.status(404);
      throw new Error('Table not found');
    }

    // Remove the item from the cart based on cart_item_id
    table.cart = table.cart.filter((cartItem) => cartItem._id.toString() !== cartItemId);

    // Save the updated table
    await table.save();

    res.status(200).json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Get the cart for a specific table
// @route   GET /tables/:restaurantId/:tableId/cart
// @access  Public
const getCart = asyncHandler(async (req, res) => {
  const { restaurantId, tableId } = req.params;

  try {
    // Find the table by ID and restaurant
    const table = await Table.findOne({ _id: tableId, restaurant: restaurantId })
      .populate('cart.menuItem');

    if (!table) {
      res.status(404).json({ message: 'Table not found' });
      return;
    }

    // Return the cart items
    res.status(200).json({ cart: table.cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// @desc    Get the order_list for a specific table
// @route   GET /tables/:restaurantId/:tableId/orders
// @access  Public
const getOrders = asyncHandler(async (req, res) => {
  const { restaurantId, tableId } = req.params;

  try {
    // Find the table by ID and restaurant
    const table = await Table.findOne({ _id: tableId, restaurant: restaurantId })
      .populate('order_list');

    if (!table) {
      res.status(404).json({ message: 'Table not found' });
      return;
    }

    // Return the order_list
    res.status(200).json({ order_list: table.order_list });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc  Get a list of all restaurants
// @route GET /tables/restaurants
// @access Public
const getAllRestaurants = asyncHandler(async (req, res) => {
  // Find all restaurants within Restaurant collection in MongoDB
  const allRestaurants = await Restaurant.find({});

  // return an array of all the restaurants
  if (allRestaurants.length === 0) {
    // No content
    res.status(204).json(allRestaurants);
  } else {
    // There is at least one restaurant in the database and its returned in an array
    res.status(200).json(allRestaurants);
  }
});

  export {
  addItem, addTable, getAllRestaurants, getCart, getOrders,
  getPendingRequestsForAssistance, getTableNumbers, removeItem, requestAssistance, sendOrder, tableSelect, updateRequestsForAssistance
};

