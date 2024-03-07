import express from 'express';
import { addCategory, addItem, getMenu, updateCategoriesOrder, updateMenuItemDetails, updateMenuItemsOrder } from '../controllers/menuController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/menu', protect, getMenu);
router.post('/menu/categories', protect, addCategory);
router.post('/menu/categories/:categoryId/items', protect, addItem);
router.put('/menu/categories/order', updateCategoriesOrder);
router.put('/menu/categories/:categoryId/items/order', updateMenuItemsOrder);
router.patch('/menu/categories/:categoryId/items/:itemId', updateMenuItemDetails);

export default router;