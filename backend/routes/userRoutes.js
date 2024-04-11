import express from 'express';
import { authUser, deleteUser, getRestaurant, getUserProfile, getUserProfiles, logoutUser, registerStaff, registerUser, 
    updateUserProfile, requestPasswordReset, validateVerificationCode, passwordReset, updateStaffProfile} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.delete('/delete/:id', deleteUser)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/registerStaff', protect, registerStaff);
router.get('/profiles', protect, getUserProfiles);
router.put('/editStaff', protect, updateStaffProfile)
router.get('/restaurant', protect, getRestaurant);
router.post('/password/reset', requestPasswordReset);
router.put('/password/reset', passwordReset)
router.post('/password/reset/verify', validateVerificationCode);

export default router;
