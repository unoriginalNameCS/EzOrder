import asyncHandler from 'express-async-handler';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    res.json({ message: 'Success' });
  });
  
// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    res.json({messsage: 'Register User'});
  });
  
  // @desc    Logout user / clear cookie
  // @route   POST /api/users/logout
  // @access  Public
  const logoutUser = (req, res) => {
    res.json({Message: 'Logout User'});
  };

export {
    authUser,
    registerUser,
    logoutUser,
};