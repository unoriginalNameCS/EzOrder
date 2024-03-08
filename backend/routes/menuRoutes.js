import express from 'express';
import { addCategory, addItem, getMenu, updateCategoriesOrder, updateMenuItemDetails, updateMenuItemsOrder } from '../controllers/menuController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:restaurantId/menu', protect, getMenu);
router.post('/:restaurantId/menu/categories', protect, addCategory);
router.post('/:restaurantId/menu/categories/:categoryId/items', protect, addItem);
router.put('/:restaurantId/menu/categories/order', protect, updateCategoriesOrder);
router.put('/:restaurantId/menu/categories/:categoryId/items/order', protect, updateMenuItemsOrder);
router.patch('/:restaurantId/menu/categories/:categoryId/items/:itemId', protect, updateMenuItemDetails);

export default router;