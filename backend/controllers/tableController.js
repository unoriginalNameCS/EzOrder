import asyncHandler from 'express-async-handler';
import Restaurant from '../models/restaurantModel.js';
import Table from '../models/tableModel.js';

// @desc    Sets a table status to occupied
// @route   POST /table
// @access  Public
const tableSelect = asyncHandler(async (req, res) => {
  const { tableNumber } = req.body;
  
  const table = await Table.findOne({ number:tableNumber });
  
  //check if table is occupied
  if (table.occupied) {
    res.status(401);
    throw new Error('Table is occupied');    } else {
      
  }
});

// @desc    gets all table numbers
// @route   GET /table/numbers
// @access  Public
const getTableNumbers = asyncHandler(async (req, res) => {
  const tableNumbers = await Table.find({ number })
  res.status(201).json({
    tableNumbers
  });
})

  export {
  tableSelect, getTableNumbers
  };
  