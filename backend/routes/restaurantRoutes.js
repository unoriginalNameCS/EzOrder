import express from 'express';
import { getRestaurantDetails, updateRestaurantBannerUrl, updateRestaurantLogoUrl, updateRestaurantName } from '../controllers/restaurantController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:restaurantId/details', getRestaurantDetails);
router.put('/:restaurantId/name', protect, updateRestaurantName);
router.put('/:restaurantId/logoUrl', protect, updateRestaurantLogoUrl);
router.put('/:restaurantId/bannerUrl', protect, updateRestaurantBannerUrl);

export default router;
