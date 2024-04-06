import asyncHandler from 'express-async-handler';
import Restaurant from '../models/restaurantModel.js';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // if user exists, then check if password matches
  if (user && (await user.matchPassword(password))) {
    const jwt = await generateToken(res, user._id);
    res.status(200).json({
      token: jwt,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      restaurant: user.restaurant,
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
    throw new Error(
      `Restaurant with the name '${restaurantName}' already exists.`
    );
  }

  const restaurant = await Restaurant.create({
    name: restaurantName,
  });

  // create user
  const user = await User.create({
    name,
    email,
    password,
    role: 'manager',
    restaurant,
  });
  // if given valid user form details
  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      restaurant: user.restaurant,
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
  /* res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    }); */
  // Frontend should remove userInfo from localStorage
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
// @route   GET /api/users/:/restaurantId/profiles
// @access  Private
// since @access is Private, req body contains restaurant._Id from protect method in userRoutes.js
const getUserProfiles = asyncHandler(async (req, res) => {
  // const restaurantId = req.params.restaurantId
  const { restaurantid } = req.headers;
  try {
    const users = await User.find({ restaurant: restaurantid });
    if (users.length > 0) {
      // Extract only the desired fields (_id, name, and email)
      const extractedUsers = users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }));

      res.status(200).json(extractedUsers);
    } else {
      res.status(404);
      throw new Error('No users found');
    }
  } catch (error) {
    console.log(error);
  }
});

// @desc  Update user profile
// @route  PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.id);

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

// @desc  Update user profile
// @route  DELETE /api/users/profile
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(403);
    throw new Error('Did not receive id in params');
  }

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      console.log('Document not found.');
      return; // or throw an error
    }
    res.status(200);
  } catch (error) {
    console.log(error);
  }
});

// @desc    Register a new user (automatically a manager)
// @route   POST /api/users/registerStaff
// @access  Public
const registerStaff = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const managerId = req.user._id; // Assuming manager's ID is in req.user._id
  // Find the restaurant associated with the manager
  try {
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

    // check if given invalid role
    if (role !== 'wait staff' && role !== 'kitchen staff' && role !== 'manager') {
      res.status(400);
      throw new Error(
        `Invalid role, roles can only be 'wait staff' or 'kitchen staff', 'mangager' when registering staff.`
      );
    }

    console.log('creating staff');

    // create staff user
    const user = await User.create({
      name,
      email,
      password,
      role, // 'kitchen staff' || 'wait staff'
      restaurant: manager.restaurant, // Assign to the same restaurant as the manager
    });

    if (user) {
      // Do not generate token for staff registration by manager
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurant: user.restaurant,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.log(error);
  }
});

// @desc    Get restaurant details
// @route   GET /api/users/restaurant
// @access  Private
const getRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.user.restaurant._id);
  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404);
    throw new Error('Restaurant not found');
  }
});

export {
  authUser,
  getRestaurant,
  getUserProfile,
  getUserProfiles,
  logoutUser,
  registerStaff,
  registerUser,
  updateUserProfile,
  deleteUser,
};
