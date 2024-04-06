import express from 'express';
import { getRestaurantDetails, updateRestaurantBannerUrl, updateRestaurantLogoUrl, updateRestaurantName } from '../controllers/restaurantController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:restaurantId/details', protect, getRestaurantDetails);
router.post('/:restaurantId/name', protect, updateRestaurantName);
router.post('/:restaurantId/logoUrl', protect, updateRestaurantLogoUrl);
router.delete('/:restaurantId/bannerUrl', protect, updateRestaurantBannerUrl)

export default router;
