import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import Menu from '../models/menuModel.js';
import menuItem from '../models/itemModel.js';
import menuCategory from '../models/categoryModel.js';

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
    const { name, email, password } = req.body;

    // search db for user by email
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // create user
    const user = await User.create({
        name,
        email,
        password,
    });
    // if given valid user form details
    if (user) {
        generateToken(res, user._id);
        
        res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
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
})

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
})

// @desc  Update user profile
// @route  PUT /create/menu
// @access Private
const createMenu = asyncHandler(async (req, res) => {
    // Assuming you receive menu data in req.body.menuItems
    const menu = await Menu.create({
        name,
        price,
    });
    // if given valid user form details
    if (menu) {
        generateToken(res, menu._id);
        
        res.status(201).json({
        _id: menu._id,
        name: menu.name,
        price: menu.price,
        });
    } else {
        res.status(400);
        throw new Error('Invalid menu data');
    }
      const { menuItems } = req.body;

      // Save menu items to the database (you'll need to adapt this to your schema)
      // Example: await MenuModel.create(menuItems);

  //     res.status(201).json({ message: 'Menu created successfully' });
  // } catch (error) {
  //     res.status(500).json({ error: 'Error creating menu' });
  // }
})

// @desc  view menu
// @route  PUT /menu
// @access Private
const getMenu = asyncHandler(async (req, res) => {
  const categories = await menuCategory.find({});

  res.status(201).json({categories});
})

// @desc  add category
// @route  PUT /menu
// @access Private
const addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const items = [];

  // search db for category by name
  const categoryExists = await menuCategory.findOne({ name });

  if (categoryExists) {
      res.status(400);
      throw new Error('Category already exists');
  }

  const category = await menuCategory.create({
      name,
      items,
  });

  // if category name valid
  if (category) {
    res.status(201).json({
      _id: category._id,
      name: category.name,
      items: category.items,
    });
  } else {
      res.status(400);
      throw new Error('Invalid menu data');
  }
})

// @desc  add item
// @route  PUT /menu
// @access Private
const addItem = asyncHandler(async (req, res) => {
  const { name, price, category } = req.body;

  // search db for item by name
  const itemExists = await menuItem.findOne({ name });

  if (itemExists) {
      res.status(400);
      throw new Error('Menu item already exists');
  }

  const Category = menuCategory.findOne({ name: category  });

  const item = await menuItem.create({
    name,
    price,
    category,
  });

  // if category exist and item valid
  if (Category && item) {
    // put the item in the category
    Category.items = Category.items.push(item.name);
    await Category.save();
    res.status(201).json({
      _id: item._id,
      name: item.name,
      price: item.price,
      category: item.category,
    });
  } else {
      res.status(400);
      throw new Error('Invalid menu data');
  }
})

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    createMenu,
    getMenu,
    addCategory,
    addItem,
};