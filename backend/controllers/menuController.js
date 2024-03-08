import asyncHandler from 'express-async-handler';
import MenuCategory from '../models/categoryModel.js';
import MenuItem from '../models/itemModel.js';

// @desc  view menu
// @route  GET /:restaurantId/menu
// @access Private
const getMenu = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params
  const categories = await MenuCategory.find({ restaurant : restaurantId }).populate('menuItems').sort('position');

  if (categories.length > 0) {
    res.status(200).json(categories);
  } else {
    res.status(404).json({ message: 'Menu not found' })
  }
  
});

// @desc  add category
// @route  POST /:restaurantId/menu/categories
// @access Private
const addCategory = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { name } = req.body;

  // search db for category by name
  const categoryExists = await MenuCategory.findOne({ name, restaurantId: restaurantId });
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

  // if category name valid
  if (category) {
    res.status(201).json(category);
  } else {
      res.status(400);
      throw new Error('Invalid menu data');
  }
});

// @desc  add item
// @route  POST /:restaurantId/menu/categories/:categoryId/items
// @access Private
const addItem = asyncHandler(async (req, res) => {
  const { restaurantId, categoryId } = req.params;
  const { itemName, description, price, ingredients, imageUrl } = req.body;

  // search db for category
  const category = await MenuCategory.findOne({ _id: categoryId, restaurantId: restaurantId });
  if (category) {
      res.status(400);
      throw new Error('Category already exists');
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
    itemName,
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
  const { orderedCategories } = req.body;

  // Check if the input is correct
  if (!Array.isArray(orderedCategories)) {
    res.status(400);
    throw new Error('Invalid input');
  }

  // Check if the ordered categories is actually a rearrangement
  const uniqueIds = new Set(orderedCategories.map(category => category._id));
  if (uniqueIds.size != orderedCategories.length) {
    res.status(400);
    throw new Error('Invalid category ordering');
  }
  
  const categories = await MenuCategory.find({ restaurant: restaurantId }).select('_id');
  // Check if all categories are valid in the ordered categories
  const categoryIds = categories.map(c => c.id_.toString());
  const isValidOrder = orderedCategories.every(category => categoryIds.includes(category._id));
  if (!isValidOrder) {
    res.status(400);
    throw new Error('Invalid category ordering');
  }

  // Rearrange the categories
  try {
    await Promise.all(orderedCategories.map(async (category, index) => {
      
      const categoryToUpdate = await MenuCategory.findOne({_id: category._id, restaurant: restaurantId });
      if (categoryToUpdate) {
        await MenuCategory.findByIdAndUpdate(categoryToUpdate._id, { position: index });
      }     
    }));

    res.status(200).json({ message: 'Categories order updated'})   
  } catch (error) {
      res.status(500).json({ message: 'Error updating categories order', error: error.message })
  }
});

// @desc  update order of menu items within a category
// @route  PUT /:restaurantId/menu/categories/:categoryId/items/order
// @access Private
const updateMenuItemsOrder = asyncHandler(async (req, res) => {
    const { restaurantId, categoryId } = req.params;
    const { orderedItems } = req.body;

    // Check if the input is correct
    if (!Array.isArray(orderedItems)) {
        res.status(400);
        throw new Error('Invalid input');
    }
    
    // Check if category is valid
    const category = await MenuCategory.findById({_id: categoryId, restaurant: restaurantId});
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    // Check if the ordered items is actually a rearrangement
    const uniqueIds = new Set(orderedItems.map(item => item._id));
    if (uniqueIds.size != orderedItems.length) {
      res.status(400);
      throw new Error('Invalid item ordering');
    }
    
    // Check if all items are valid in the ordered items
    const items = await MenuItem.find({ category: categoryId }).select('_id');
    const itemIds = items.map(item => item._id.toString());
    const isValidOrder = orderedItems.every(item => itemIds.includes(item._id));
    if (!isValidOrder) {
      res.status(400);
      throw new Error('Invalid item ordering');
    }

    // Rearrange the items
    try {
      await Promise.all(orderedItems.map(async (item, index) => {
          await MenuItem.findByIdAndUpdate({_id: item._id, category: categoryId}, {position: index });
      }));

      res.status(200).json({ message: 'Menu items order updated'})   
    } catch (error) {
      res.status(500).json({ message: 'Error updating items order', error: error.message })
    }
});

// @desc  update menu item details
// @route  PATCH /:restaurantId/menu/categories/:categoryId/items/:itemId
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

export {
  addCategory, addItem, getMenu, updateCategoriesOrder, updateMenuItemDetails, updateMenuItemsOrder
};

