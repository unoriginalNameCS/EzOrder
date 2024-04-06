import asyncHandler from 'express-async-handler';
import MenuItem from '../models/itemModel.js';
import Order from '../models/orderModel.js';
import Request from '../models/requestModel.js';
import Restaurant from '../models/restaurantModel.js';
import Table from '../models/tableModel.js';
import CartItem from '../models/cartItemModel.js';
// @desc    Sets a table status to occupied
// @route   PUT /tables/:restaurantId/select
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

// @desc    Sets a table status to unoccupied
// @route   PUT /tables/:restaurantId/deselect
// @access  Public
const tableDeselect = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { tableNumber } = req.body;
  
  const table = await Table.findOne({ number:tableNumber, restaurant : restaurantId });
  //check if table is occupied
  // changed error code to 400 from 401 as 401 is unauthorised
  if (!table.occupied) {
    res.status(400);
    throw new Error('Table is already unoccupied');
  } else {
    // set table occupied to true now that its being selected
    table.occupied = false
    // save the updated table in the database
    const updatedTable = await table.save();
    res.status(200).json(updatedTable);
  }
})

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
  // search db for restaurant
  const { restaurantId } = req.params;
  const restaurant = await Restaurant.findOne( { _id: restaurantId });
  if (!restaurant) {
    res.status(400);
    throw new Error(
      `Restaurant don't exist.`
    );
  }
  // Find last table based on number
  const lastTable = await Table.findOne({ restaurant : restaurantId }).sort({number: -1})
  const number = lastTable ? lastTable.number + 1 : 1;

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

// @desc  Remove last table
// @route  DELETE /tables/:restaurantId/remove
// @access Public
const removeTable = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const restaurant = await Restaurant.findOne({ _id: restaurantId });
  if (!restaurant) {
    res.status(400);
    throw new Error('Restaurant does not exist.');
  }

  // Find the last table based on number
  const lastTable = await Table.findOne({ restaurant: restaurantId }).sort({ number: -1 });
  if (!lastTable) {
    res.status(404);
    throw new Error('No tables found to delete.');
  }

  // Remove the last table
  await Table.findByIdAndRemove(lastTable._id);

  // Send a response back
  res.status(200).json({ message: 'Last table removed successfully.' });
});

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

  const lastRequest = await Request.findOne({ restaurant : restaurantId }).sort({requestNum: -1})
  const number = lastRequest ? lastRequest.requestNum + 1 : 1;

  const request = await Request.create({
    restaurant: restaurantId,
    state: 'waiting',
    tableNum: table.number,
    requestedBill: requestedBill,
    time: new Date(),
    requestNum: number
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

  if (table.cart.length == 0) {
    res.status(400);
    throw new Error('Cannot send an order with an empty cart')
  }

  const lastOrder = await Order.findOne({ restaurant : restaurantId }).sort({orderNum: -1})
  const number = lastOrder ? lastOrder.orderNum + 1 : 1;

  const order = await Order.create({
    restaurant: restaurantId,
    tableNum: table.number,
    items: table.cart,
    time: new Date(),
    state: "pending",
    orderNum: number
  });
  if (order) {
    // Empties the cart
    table.cart = [];
    // Add cart to order
    table.order_list.push(order)
    await table.save();
    
    res.status(201).json(order);
  } else {
      res.status(400);
      throw new Error('invalid');
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

    // Check if the item already exists in the cart
    // const existingCartItem = table.cart.find(item => String(item) === String(itemId) && item.notes === notes);
    const tableCart = await Table.findOne({ _id: tableId, restaurant: restaurantId }).populate('cart');

    var existingCartItem = "";
    for (const cartItem of tableCart.cart) {
      if (String(cartItem.menuItem) == String(itemId) && cartItem.notes == notes) {
        var existingCartItem = cartItem;
      }
    }

    if (existingCartItem) {
      // If the item already exists, update its quantity
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      res.status(200).json({ message: 'Quantity updated successfully' });
    } else {
      // Assuming you have a MenuItem model and want to add it to the cart
      const menuItem = await MenuItem.findById(itemId);

      if (!menuItem) {
        res.status(404);
        throw new Error('Menu item not found');
      }

      const cartItem = await CartItem.create({
        menuItem,
        notes,
        quantity
      });

      if (cartItem) {
        // Add the item to the cart
        table.cart.push(cartItem);

        // Save the updated table
        await table.save();

        res.status(200).json({ message: 'Item added to cart successfully' });  
      }
    }
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

    table.cart = table.cart.filter((cartItem) => cartItem._id.toString() != cartItemId);

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

  // Find the table by ID and restaurant and populate the menuItem details
  const table = await Table.findOne({ _id: tableId, restaurant: restaurantId }).populate({
    path: 'cart', populate: {path: 'menuItem', model: 'MenuItem'}});


  if (!table) {
    res.status(404).json({ message: 'Table not found' });
    return;
  }

  const cart = table.cart.map(item => ({
    _id: item._id,
    menuItem: item.menuItem, // This will include all menuItem details
    notes: item.notes,
    quantity: item.quantity
  }));

  // Return the populated cart items
  if (cart.length > 0) {
    res.status(200).json(cart); 
  } else {
    res.status(204).json(cart);  
  }
});

// @desc    Get the order_list for a specific table
// @route   GET /tables/:restaurantId/:tableId/orders
// @access  Public
const  getOrders = asyncHandler(async (req, res) => {
  const { restaurantId, tableId } = req.params;
  // Find the table by ID and restaurant
  const table = await Table.findOne({ _id: tableId, restaurant: restaurantId })

  if (!table) {
    res.status(404).json({ message: 'Table not found' });
    return;
  }

  // Return the order_list
  if (table.order_list.length > 0) {
    res.status(200).json(table.order_list);  
  } else {
    // Retuern empty list
    res.status(204).json(table.order_list);   
  }
  
});

// @desc    Get all ordered items for a table
// @route   GET /tables/:restaurantId/:tableId/orders/items
// @access  Public
const getOrdersItems = asyncHandler(async (req, res) => {
  const { restaurantId, tableId } = req.params;
  // Find the table by ID and restaurant
  const table = await Table.findOne({ _id: tableId, restaurant: restaurantId }).populate({
    path: 'order_list',
    populate: {
        path: 'items',
        model: 'CartItem' // Assuming 'CartItem' is the name of the model for items
    }
  });


  if (!table) {
    res.status(404).json({ message: 'Table not found' });
    return;
  }

  let items = []
  for (let order of table.order_list) {
    for (let item of order.items) {
      items.push({id: item.menuItem, quantity: item.quantity, notes: item.notes})
    }
  }
  let ids = items.map(item => item.id)
  try {
    // Populate the menuItemIds array with the MenuItems matching the provided IDs
    const menuItems = await MenuItem.find({ _id: { $in: ids } });
    let orderedItems = menuItems.map(x => x.name)
    // Now populate the itemsArray with MenuItems according to their 'name' property
    const populatedItemsArray = items.map(item => {
      const menuItem = menuItems.find(menuItem => menuItem._id.toString() === item.id.toString());
      return { menuItem, quantity: item.quantity, notes: item.notes};
    });
      // Return the order_list
    if (orderedItems.length > 0) {
      res.status(200).json(populatedItemsArray);  
    } else {
      // Retuern empty list
      res.status(204).json(orderedItems);   
    }
  } catch (error) {
      console.error('Error populating MenuItems:', error);
  }
  
});

// @desc    Get the order_list for a specific table
// @route   GET /tables/:restaurantId/tables
// @access  Public
const getTables = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  // Find the table by ID and restaurant
  const tables = await Table.find({ restaurant: restaurantId });

  if (!tables) {
    res.status(404).json({ message: 'Tables not found' });
    return;
  }

  // Return the order_list
  if (tables.length > 0) {
    res.status(200).json(tables);  
  } else {
    // Return empty list
    res.status(204).json(tables);   
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
  addItem, addTable, getAllRestaurants, getCart, getOrders, getTableNumbers, removeItem, 
  requestAssistance, sendOrder, tableSelect, tableDeselect, getTables, getOrdersItems,
  removeTable
};