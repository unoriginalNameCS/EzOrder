import express from 'express';
import { getRestaurantDetails, updateRestaurantBannerUrl, updateRestaurantLogoUrl, updateRestaurantName } from '../controllers/restaurantController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Used in SettingsScreen.jsx
router.get('/:restaurantId/details', protect, getRestaurantDetails);
router.put('/:restaurantId/name', protect, updateRestaurantName);
router.put('/:restaurantId/logoUrl', protect, updateRestaurantLogoUrl);
router.put('/:restaurantId/bannerUrl', protect, updateRestaurantBannerUrl);

export default router;
