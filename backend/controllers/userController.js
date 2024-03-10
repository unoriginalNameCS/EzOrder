import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import Restaurant from '../models/restaurantModel.js';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // if user exists, then check if password matches
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});
  
// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, restaurantName } = req.body;

    // search db for user by email
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // search db for restaurant
    const restaurantExists = await Restaurant.findOne({ name: restaurantName });

    if (restaurantExists) {
        res.status(400);
        throw new Error(`Restaurant with the name '${restaurantName}' already exists.`);
    }

    const restaurant = await Restaurant.create({
      name: restaurantName
    })

    // create user
    const user = await User.create({
      name,
      email,
      password,
      role: 'manager',
      restaurant
    });
    // if given valid user form details
    if (user) {
        generateToken(res, user._id);
        
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          restaurant: user.restaurant
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});
  
// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};


// @desc    Get user details
// @route   GET /api/users/profile
// @access  Private
// since @access is Private, req body contains user._Id from protect method in userRoutes.js
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user details
// @route   GET /api/users/profiles
// @access  Private
// since @access is Private, req body contains restaurant._Id from protect method in userRoutes.js
const getUserProfiles = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const users = await User.find( {restaurant : restaurantId} );

  if (users.length > 0) {
    // Extract only the desired fields (_id, name, and email)
    const extractedUsers = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
    }));

    res.status(200).json(extractedUsers);
  } else {
    res.status(404);
    throw new Error('No users found');
  }
});

// @desc  Update user profile
// @route  PUT /api/users/profile 
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Register a new user (automatically a manager)
// @route   POST /api/users/registerStaff
// @access  Public
const registerStaff = asyncHandler(async (req, res) => {
  
  const { name, email, password, role } = req.body;
  const managerId = req.user._id; // Assuming manager's ID is in req.user._id

  // Find the restaurant associated with the manager
  const manager = await User.findById(managerId);
  if (!manager || manager.role !== 'manager') {
    res.status(401);
    throw new Error('Not authorized as manager');
  }

  // search db for user by email
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // create staff user
  const user = await User.create({
    name,
    email,
    password,
    role, // 'staff'
    restaurant: manager.restaurant // Assign to the same restaurant as the manager
  });

  if (user) {
    // Do not generate token for staff registration by manager
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      restaurant: user.restaurant
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

export {
  authUser, getUserProfile, getUserProfiles, logoutUser, registerStaff, registerUser, updateUserProfile
};

