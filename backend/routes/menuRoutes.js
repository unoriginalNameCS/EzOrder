import express from 'express';
import { addCategory, addItem, getCategories, getMenu, getMenuItemDetails, getMenuItems, updateCategoriesOrder, updateMenuItemDetails, updateMenuItemsOrder, getMenuCategory, removeMenuItem, removeMenuCategory } from '../controllers/menuController.js';
import { getCustomerMenu, getCustomerCategories, getCustomerMenuCategory, getCustomerMenuItems, getCustomerMenuItemDetails } from '../controllers/customerMenuController.js'
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:restaurantId/menu', protect, getMenu);
router.get('/:restaurantId/menu/categories', protect, getCategories);
router.get('/:restaurantId/menu/categories/:categoryId/items', protect, getMenuItems);
router.post('/:restaurantId/menu/categories/add', protect, addCategory);
router.post('/:restaurantId/menu/categories/:categoryId/items/add', protect, addItem);
router.put('/:restaurantId/menu/categories/order', protect, updateCategoriesOrder);
router.put('/:restaurantId/menu/categories/:categoryId/items/order', protect, updateMenuItemsOrder);
router.get('/:restaurantId/menu/categories/:categoryId/', protect, getMenuCategory);
router.get('/:restaurantId/menu/categories/:categoryId/items/:itemId', protect, getMenuItemDetails)
router.patch('/:restaurantId/menu/categories/:categoryId/items/:itemId/update', protect, updateMenuItemDetails);
router.delete('/:restaurantId/menu/categories/:categoryId/items/:itemId/remove', protect, removeMenuItem);
router.delete('/:restaurantId/menu/categories/:categoryId/remove', protect, removeMenuCategory);

// Customer Menu Routes
router.get('/:restaurantId/:tableId/menu', getCustomerMenu);
router.get('/:restaurantId/:tableId/menu/categories', getCustomerCategories);
router.get('/:restaurantId/:tableId/menu/categories/:categoryId', getCustomerMenuCategory);
router.get('/:restaurantId/:tableId/menu/categories/:categoryId/items', getCustomerMenuItems);
router.get('/:restaurantId/:tableId/menu/categories/:categoryId/items/:itemId', getCustomerMenuItemDetails);



export default router;