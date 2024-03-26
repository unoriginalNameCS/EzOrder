import asyncHandler from 'express-async-handler';
import MenuCategory from '../models/categoryModel.js';
import MenuItem from '../models/itemModel.js';

// @desc  view menu
// @route  GET /:restaurantId/:tableId/menu
// @access Public
const getCustomerMenu = asyncHandler(async (req, res) => {
  const { restaurantId, tableId } = req.params;
  const categories = await MenuCategory.find({ restaurant : restaurantId }).sort('position');
  const populatedCategories = await MenuCategory.populate(categories, {path: 'menuItems', options: { sort: { position: 1}}});

  if (populatedCategories.length > 0) {
    res.status(200).json(categories);
  } else {
    res.status(404).json({ populatedCategories: 'Menu not found' })
  }
});

// @desc  view categories
// @route  GET /:restaurantId/:tableId/menu/categories
// @access Public
const getCustomerCategories = asyncHandler(async (req, res) => {
  const { restaurantId, tableId } = req.params;
  const categories = await MenuCategory.find({ restaurant : restaurantId}).sort('position');

  if (categories.length > 0) {
    res.status(200).json(categories);
  } else {
    res.status(404).json({ message: 'No Categories' })
  }
});

// @desc  view items
// @route  GET /:restaurantId/:tableId/menu/categories/:categoryId/items
// @access Public
const getCustomerMenuItems = asyncHandler(async (req, res) => {
  const { restaurantId, tableId, categoryId } = req.params;
  const menuItems = await MenuItem.find({ category : categoryId }).sort('position');

  if (menuItems.length > 0) {
    res.status(200).json(menuItems);
  } else {
    res.status(200).json(menuItems);
  }
})

// @desc  getCategoryItem
// @route  GET /:restaurantId/:tableId/menu/categories/:categoryId
// @access Public
const getCustomerMenuCategory = asyncHandler(async (req, res) => {
  const { restaurantId, tableId, categoryId } = req.params;

  const category = await MenuCategory.findOne({_id: categoryId});
  if (!category) {
      res.status(404);
      throw new Error('Menu category not found');
  }
  res.status(200).json(category);
});

// @desc  get menu item details
// @route  GET /:restaurantId/:tableId/menu/categories/:categoryId/items/:itemId
// @access Public
const getCustomerMenuItemDetails = asyncHandler(async (req, res) => {
  const { restaurantId, tableId, categoryId, itemId } = req.params;

  const item = await MenuItem.findOne({_id: itemId, category: categoryId});
  if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
  }
  res.status(200).json(item);
});

export {
  getCustomerMenu,
  getCustomerCategories,
  getCustomerMenuItems,
  getCustomerMenuCategory,
  getCustomerMenuItemDetails
}

