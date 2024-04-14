import express from 'express';
import { addCategory, addItem, getCategories, getMenu, getMenuItemDetails, getMenuItems, updateCategoriesOrder, updateMenuItemDetails, updateMenuItemsOrder, getMenuCategory, removeMenuItem, removeMenuCategory } from '../controllers/menuController.js';
import { getCustomerMenu, getCustomerCategories, getCustomerMenuCategory, getCustomerMenuItems, getCustomerMenuItemDetails } from '../controllers/customerMenuController.js'
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// UNUSED /////////////////
router.get('/:restaurantId/menu', protect, getMenu);

// Used in MenuScreen.jsx and CategoriesBar.jsx
router.get('/:restaurantId/menu/categories', protect, getCategories);

// Used in MenuScreen.jsx
router.get('/:restaurantId/menu/categories/:categoryId/items', protect, getMenuItems);

// Used in NewCategoryModal.jsx
router.post('/:restaurantId/menu/categories/add', protect, addCategory);

// Used in NewItemModal.jsx
router.post('/:restaurantId/menu/categories/:categoryId/items/add', protect, addItem);

// Used in EditCategoryModal.jsx
router.put('/:restaurantId/menu/categories/order', protect, updateCategoriesOrder);

// Used in EditItemModal.jsx
router.put('/:restaurantId/menu/categories/:categoryId/items/order', protect, updateMenuItemsOrder);

// UNUSED //////////////////
router.get('/:restaurantId/menu/categories/:categoryId', protect, getMenuCategory);
router.get('/:restaurantId/menu/categories/:categoryId/items/:itemId', protect, getMenuItemDetails)

// Used in EditItemModal.jsx
router.patch('/:restaurantId/menu/categories/:categoryId/items/:itemId/update', protect, updateMenuItemDetails);

// Used in DeleteItemModal.jsx
router.delete('/:restaurantId/menu/categories/:categoryId/items/:itemId/remove', protect, removeMenuItem);

// Used in DeleteCategoryModal.jsx
router.delete('/:restaurantId/menu/categories/:categoryId/remove', protect, removeMenuCategory);

// Customer Menu Routes

// UNUSED ////////////////////
router.get('/:restaurantId/:tableId/menu', getCustomerMenu);

// Used in CustomerCategoriesBar.jsx and CustomerMenuScreen.jsx
router.get('/:restaurantId/:tableId/menu/categories', getCustomerCategories);

// UNUSED /////////////////////
router.get('/:restaurantId/:tableId/menu/categories/:categoryId', getCustomerMenuCategory);

// Used in CustomerMenuScreen.jsx
router.get('/:restaurantId/:tableId/menu/categories/:categoryId/items', getCustomerMenuItems);

// Used in CustomerItemModal.jsx
router.get('/:restaurantId/:tableId/menu/categories/:categoryId/items/:itemId', getCustomerMenuItemDetails);



export default router;