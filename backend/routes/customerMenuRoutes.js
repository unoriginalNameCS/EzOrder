import express from 'express';
import { getCustomerCategories, getCustomerMenuCategory, getCustomerMenuItems, getCustomerMenuItemDetails } from '../controllers/customerMenuController.js'
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:restaurantId/:tableId/menu/categories', getCustomerCategories);
router.get('/:restaurantId/:tableId/menu/categories/:categoryId', getCustomerMenuCategory);
router.get('/:restaurantId/:tableId/menu/categories/:categoryId/items', getCustomerMenuItems);
router.get('/:restaurantId/:tableId/menu/categories/:categoryId/items/:itemId', getCustomerMenuItemDetails);

export default router;