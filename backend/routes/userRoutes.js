import express from 'express';
import { authUser, getRestaurant, getUserProfile, getUserProfiles, logoutUser, registerStaff, registerUser, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/registerStaff', protect, registerStaff);
router.get('/profiles', protect, getUserProfiles);
router.get('/restaurant', protect, getRestaurant)

export default router;
