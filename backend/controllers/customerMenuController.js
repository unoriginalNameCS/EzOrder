import asyncHandler from 'express-async-handler';
import MenuCategory from '../models/categoryModel.js';
import MenuItem from '../models/itemModel.js';

/**
 * @desc    View categories
 * @route   GET /customermenus/:restaurantId/:tableId/menu/categories
 * @access  Public
 * @param req.params.restaurantId - id of restaurant
 * @returns {List: [MenuCategory]}
 */
const getCustomerCategories = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const categories = await MenuCategory.find({ restaurant : restaurantId}).sort('position');

  if (categories.length > 0) {
    res.status(200).json(categories);
  } else {
    res.status(404).json({ message: 'No Categories' })
  }
});

/**
 * @desc    View items
 * @route   GET /customermenus/:restaurantId/:tableId/menu/categories/:categoryId/items
 * @access  Public
 * @param req.params.categoryId - id of the category
 * @returns {List: [MenuItem]}
 */
const getCustomerMenuItems = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const menuItems = await MenuItem.find({ category : categoryId }).sort('position');

  if (menuItems.length > 0) {
    res.status(200).json(menuItems);
  } else {
    res.status(200).json(menuItems);
  }
})

/**
 * @desc    Get Category
 * @route   GET /customermenus/:restaurantId/:tableId/menu/categories/:categoryId
 * @access  Public
 * @param req.params.categoryId - id of the category
 * @returns {MenuCategory}
 */
const getCustomerMenuCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await MenuCategory.findOne({_id: categoryId});
  if (!category) {
      res.status(404);
      throw new Error('Menu category not found');
  }
  res.status(200).json(category);
});

/**
 * @desc    Get item
 * @route   GET /customermenus/:restaurantId/:tableId/menu/categories/:categoryId/items/:itemId
 * @access  Public
 * @param req.params.categoryId - id of category the item is in
 * @param req.params.itemId - id of the item
 * @returns {List: [MenuItem]}
 */
const getCustomerMenuItemDetails = asyncHandler(async (req, res) => {
  const { categoryId, itemId } = req.params;

  const item = await MenuItem.findOne({_id: itemId, category: categoryId});
  if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
  }
  res.status(200).json(item);
});

export {
  getCustomerCategories,
  getCustomerMenuItems,
  getCustomerMenuCategory,
  getCustomerMenuItemDetails
}

