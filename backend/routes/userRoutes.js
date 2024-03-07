import express from 'express';
import { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { createMenu, getMenu, addCategory, addItem } from '../controllers/userController.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

router.put('/createmenu', protect, createMenu);
router.post('/menu', protect, getMenu);
router.put('/menu', protect, addCategory);
router.put('/menu', protect, addItem);

export default router;