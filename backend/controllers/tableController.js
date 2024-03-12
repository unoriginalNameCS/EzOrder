import asyncHandler from 'express-async-handler';
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
  if (table.occupied) {
    res.status(401);
    throw new Error('Table is occupied');    
  } else {
    res.status(200).json(table);
  }
});

// @desc    gets all table numbers
// @route   GET /tables/:restaurantId/numbers
// @access  Public
const getTableNumbers = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params

  const tableNumbers = await Table.find({ restaurant : restaurantId }).select('number')
  if (tableNumbers) {
    res.status(201).json({
      tableNumbers
    });
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

  export {
  tableSelect, getTableNumbers, addTable
  };
