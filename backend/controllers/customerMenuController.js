import asyncHandler from 'express-async-handler';
import MenuCategory from '../models/categoryModel.js';
import MenuItem from '../models/itemModel.js';

// @desc  view menu
// @route  GET /:restaurantId/:tableId/menu
// @access Public
const getCustomerMenu = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const categories = await MenuCategory.find({ restaurant : restaurantId }).sort('position');
  const populatedCategories = await MenuCategory.populate(categories, {path: 'menuItems', options: { sort: { position: 1}}});

  if (populatedCategories.length > 0) {
    res.status(200).json(categories);
  } else {
    res.status(404).json({ populatedCategories: 'Menu not found' })
  }
});

// @desc  view categories
// @route  GET /:restaurantId/:tableId/menu
// @access Public
const getCustomerCategories = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const categories = await MenuCategory.find({ restaurant : restaurantId}).sort('position');

  if (categories.length > 0) {
    res.status(200).json(categories);
  } else {
    res.status(404).json({ message: 'No Categories' })
  }
});

export {
  getCustomerMenu,
  getCustomerCategories
}

