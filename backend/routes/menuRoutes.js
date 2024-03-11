import express from 'express';
import { addCategory, addItem, getCategories, getMenu, getMenuItemDetails, getMenuItems, updateCategoriesOrder, updateMenuItemDetails, updateMenuItemsOrder } from '../controllers/menuController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:restaurantId/menu', protect, getMenu);
router.get('/:restaurantId/menu/categories', protect, getCategories);
router.get('/:restaurantId/menu/categories/:categoryId/items', protect, getMenuItems);
router.post('/:restaurantId/menu/categories/add', protect, addCategory);
router.post('/:restaurantId/menu/categories/:categoryId/items/add', protect, addItem);
router.put('/:restaurantId/menu/categories/order', protect, updateCategoriesOrder);
router.put('/:restaurantId/menu/categories/:categoryId/items/order', protect, updateMenuItemsOrder);
router.get('/:restaurantId/menu/categories/:categoryId/items/:itemId', protect, getMenuItemDetails)
router.patch('/:restaurantId/menu/categories/:categoryId/items/:itemId/update', protect, updateMenuItemDetails);

export default router;