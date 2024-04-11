import asyncHandler from 'express-async-handler';
import MenuCategory from '../models/categoryModel.js';
import MenuItem from '../models/itemModel.js';
import Restaurant from '../models/restaurantModel.js';

// @desc  view menu
// @route  GET /:restaurantId/menu
// @access Private
const getMenu = asyncHandler(async (req, res) => {
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
// @route  GET /:restaurantId/menu/categories
// @access Private
const getCategories = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const categories = await MenuCategory.find({ restaurant : restaurantId}).sort('position');

  res.status(200).json(categories);
});

// @desc  add category
// @route  POST /:restaurantId/menu/categories/add
// @access Private
const addCategory = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { name } = req.body;

  // search db for category by name
  const categoryExists = await MenuCategory.findOne({ name, restaurant: restaurantId });
  if (categoryExists) {
      res.status(400);
      throw new Error('Category already exists');
  }

  // Find category with highest position (at the end)
  const highestPosCategory = await MenuCategory.findOne({ restaurant: restaurantId }).sort({ position: -1 }).limit(1);

  // If there are no categories start with 1 otherwise increment the highest pos by 1
  const position = highestPosCategory ? highestPosCategory.position + 1 : 1;
  
  const category = await MenuCategory.create({
      name,
      position,
      restaurant: restaurantId
  });

  console.log(category);

  // if category name valid
  if (category) {
    res.status(201).json(category);
  } else {
      res.status(400);
      throw new Error('Invalid menu data');
  }
});

// @desc  view items
// @route  GET /:restaurantId/menu/categories/:categoryId/items
// @access Private
const getMenuItems = asyncHandler(async (req, res) => {
  const { restaurantId, categoryId } = req.params;
  const menuItems = await MenuItem.find({ category : categoryId }).sort('position');

  res.status(200).json(menuItems);
})

// @desc  add item
// @route  POST /:restaurantId/menu/categories/:categoryId/items/add
// @access Private
const addItem = asyncHandler(async (req, res) => {
  const { restaurantId, categoryId } = req.params;
  const { itemName, description, price, ingredients, imageUrl } = req.body;

  // search db for category
  const category = await MenuCategory.findOne({ _id: categoryId, restaurant: restaurantId });
  if (!category) {
      res.status(404);
      throw new Error('Category not found');
  }

  // search db for item
  const itemExists = await MenuItem.findOne({ name: itemName, category: categoryId});
  if (itemExists) {
      res.status(400);
      throw new Error('Menu item already exists');
  }

  // Find the last item in the category to determine new item's pos
  const lastItem = await MenuItem.findOne({ category: categoryId }).sort({ position: -1});
  const position = lastItem ? lastItem.position + 1 : 1;

  const item = await MenuItem.create({
    name: itemName,
    description,
    price,
    ingredients,
    imageUrl,
    category: categoryId,
    position
  });

  if (item) {
    category.menuItems.push(item._id);
    await category.save();

    res.status(201).json(item);
  } else {
    res.status(400);
    throw new Error('Invalid menu item');
  }
});

// @desc  update order of categories
// @route  PUT /:restaurantId/menu/categories/order
// @access Private
const updateCategoriesOrder = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { categoryName, newPosition } = req.body;

  // Validate the input
  //if (typeof newPosition !== 'number' || typeof categoryName !== 'string') {
  //  return res.status(400).json({ message: 'Invalid input' });
  //}

  try {
    // Find the category to update
    const categoryToUpdate = await MenuCategory.findOne({ name: categoryName, restaurant: restaurantId });
    if (!categoryToUpdate) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Calculate the direction of the shift (up or down)
    const shiftDirection = newPosition > categoryToUpdate.position ? 'down' : 'up';

    // Update the positions of the categories
    const categories = await MenuCategory.find({ restaurant: restaurantId }).sort({ position: 1 });
    for (let category of categories) {
      if (shiftDirection === 'down' && category.position > categoryToUpdate.position && category.position <= newPosition) {
        await MenuCategory.findByIdAndUpdate(category._id, { $inc: { position: -1 } });
      } else if (shiftDirection === 'up' && category.position < categoryToUpdate.position && category.position >= newPosition) {
        await MenuCategory.findByIdAndUpdate(category._id, { $inc: { position: 1 } });
      }
    }

    // Update the position of the target category
    await MenuCategory.findByIdAndUpdate(categoryToUpdate._id, { position: newPosition });

    res.status(200).json({ message: 'Categories order updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating categories order', error: error.message });
  }
});

// @desc  update order of menu items within a category
// @route  PUT /:restaurantId/menu/categories/:categoryId/items/order
// @access Private
const updateMenuItemsOrder = asyncHandler(async (req, res) => {
  const { restaurantId, categoryId } = req.params;
  const { itemName, newPosition } = req.body;

  // Validate the input
  //if (typeof newPosition !== 'number' || typeof categoryName !== 'string') {
  //  return res.status(400).json({ message: 'Invalid input' });
  //}

  try {
    // Find the category to update
    const category = await MenuCategory.findById({ _id: categoryId, restaurant: restaurantId });
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    } 
    const itemToUpdate = await MenuItem.findOne({ name: itemName, category});
    if (!itemToUpdate) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Calculate the direction of the shift (up or down)
    const shiftDirection = newPosition > itemToUpdate.position ? 'down' : 'up';

    // Update the positions of the items
    const items = await MenuItem.find({ category }).sort({ position: 1 });
    for (let item of items) {
      if (shiftDirection === 'down' && item.position > itemToUpdate.position && item.position <= newPosition) {
        await MenuItem.findByIdAndUpdate(item._id, { $inc: { position: -1 } });
      } else if (shiftDirection === 'up' && item.position < itemToUpdate.position && item.position >= newPosition) {
        await MenuItem.findByIdAndUpdate(item._id, { $inc: { position: 1 } });
      }
    }

    // Update the position of the target item
    await MenuItem.findByIdAndUpdate(itemToUpdate._id, { position: newPosition });

    res.status(200).json({ message: 'Item order updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating item order', error: error.message });
  }
});

// @desc  getCategoryItem
// @route  GET /:restaurantId/menu/categories/:categoryId/items/:itemId
// @access Private
const getMenuCategory = asyncHandler(async (req, res) => {
  const { restaurantId, categoryId } = req.params;

  const category = await MenuCategory.findOne({_id: categoryId});
  if (!category) {
      res.status(404);
      throw new Error('Menu category not found');
  }
  res.status(200).json(category);
});

// @desc  get menu item details
// @route  GET /:restaurantId/menu/categories/:categoryId/items/:itemId
// @access Private
const getMenuItemDetails = asyncHandler(async (req, res) => {
  const { restaurantId, categoryId, itemId } = req.params;

  const item = await MenuItem.findOne({_id: itemId, category: categoryId});
  if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
  }
  res.status(200).json(item);
});

// @desc  update menu item details
// @route  PATCH /:restaurantId/menu/categories/:categoryId/items/:itemId/update
// @access Private
const updateMenuItemDetails = asyncHandler(async (req, res) => {
    const { restaurantId, categoryId, itemId } = req.params;
    const {name, price, description, ingredients, imageUrl } = req.body;

    const item = await MenuItem.findOne({_id: itemId, category: categoryId});
    if (!item) {
        res.status(404);
        throw new Error('Menu item not found');
    }

    item.name = name || item.name;
    item.price = price || item.price;
    item.description = description || item.description
    item.ingredients = ingredients || item.ingredients
    item.imageUrl = imageUrl || item.imageUrl

    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
});

// @desc  remove menu item
// @route  DELETE /:restaurantId/menu/categories/:categoryId/items/:itemId/remove
// @access Private
const removeMenuItem = asyncHandler(async (req, res) => {
  const { restaurantId, categoryId, itemId } = req.params;
  try {
    const category = await MenuCategory.findOne({ _id: categoryId, restaurant: restaurantId });
    if (!category) {
      res.status(404);
      throw new errorHandler('Menu category not found');
    }

    const item = await MenuItem.findOne({ _id: itemId, category: categoryId });
    if (!item) {
        res.status(404);
        throw new Error('Menu item not found');
    }

    // Remove item from category
    category.menuItems.filter((menuItem) => menuItem._id.toString() != itemId);
    await category.save();

    // Reduce position by one if greater than item position and same category
    await MenuItem.updateMany({position: {$gt: item.position}, category: categoryId}, {$inc : { position: -1 }});
    
    await MenuItem.deleteOne({ _id: itemId });

    res.status(200).json({ message: 'Item deleted sucessfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc  remove menu item
// @route  DELETE /:restaurantId/menu/categories/:categoryId/remove
// @access Private
const removeMenuCategory = asyncHandler(async (req, res) => {
  const { restaurantId, categoryId } = req.params;

  try {
    const restaurant = await Restaurant.findOne({ _id: restaurantId });
    if (!restaurant) {
      res.status(404);
      throw new Error('Restaurant not found');
    }
    
    const category = await MenuCategory.findOne({ _id: categoryId, restaurant: restaurantId });
    if (!category) {
      res.status(404);
      throw new Error('Menu category not found');
    }

    console.log(category);

    // Reduce position by one if greater than category position and same restaurant
    await MenuCategory.updateMany({position: {$gt: category.position}, restaurant: restaurantId}, {$inc : { position: -1 }});
    
    // Delete menu items in category and category
    await MenuItem.deleteMany({ category: categoryId });
    await MenuCategory.deleteOne({ _id: categoryId });

    res.status(200).json({ message: 'Category deleted sucessfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export {
  addCategory, addItem, getCategories, getMenu, getMenuItemDetails, getMenuItems, 
  updateCategoriesOrder, updateMenuItemDetails, updateMenuItemsOrder, getMenuCategory,
  removeMenuItem, removeMenuCategory
};

