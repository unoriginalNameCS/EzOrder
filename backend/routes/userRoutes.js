import express from 'express';
import { authUser, deleteUser, getRestaurant, getUserProfile, getUserProfiles, logoutUser, registerStaff, registerUser, 
    updateUserProfile, requestPasswordReset, validateVerificationCode, passwordReset, updateStaffProfile} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Used in RegisterScreen.jsx
router.post('/register', registerUser);

// Used in LoginScreen.jsx
router.post('/auth', authUser);

// Used in Header.jsx
router.post('/logout', logoutUser);

// Used in DeleteStaffModal.jsx and StaffScreen.jsx
router.delete('/delete/:id', deleteUser);

// Unused ///////////
router.get('/profile', protect, getUserProfile);

// Used in ProfileScreen.jsx
router.put('/profile', protect, updateUserProfile);

// Used in NewStaffModal.jsx
router.post('/registerStaff', protect, registerStaff);

// Used in StaffScreen.jsx
router.get('/profiles', protect, getUserProfiles);

// Used in EditStaffModal.jsx
router.put('/editStaff', protect, updateStaffProfile);

// Used in EmployeeHomeScreen.jsx
router.get('/restaurant', protect, getRestaurant);

// Used in ForgotPasswordScreen.jsx
router.post('/password/reset', requestPasswordReset);
router.put('/password/reset', passwordReset);
router.post('/password/reset/verify', validateVerificationCode);

export default router;
