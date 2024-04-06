import asyncHandler from 'express-async-handler';
import Restaurant from '../models/restaurantModel.js';
  
// @desc    Get restaurant details by ID
// @route   GET /restaurants/:restaurantId/details
// @access  Public
const getRestaurantDetails = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  const restaurant = await Restaurant.findById(restaurantId).select('name logoUrl bannerUrl');
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  // If logoUrl or bannerUrl are not set, send empty strings
  const response = {
    name: restaurant.name,
    logoUrl: restaurant.logoUrl || '',
    bannerUrl: restaurant.bannerUrl || ''
  };

  res.status(200).json(response);
});

// @desc    Update restaurant name
// @route   PUT /restaurants/:restaurantId/name
// @access  Private
const updateRestaurantName = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { restaurantName } = req.body;

  // Check if the new name is unique
  const existingRestaurant = await Restaurant.findOne({ restaurantName });
  if (existingRestaurant) {
    res.status(400);
    throw new Error('Name already in use');
  }

  const restaurant = Restaurant.findOne({ _id: restaurantId })
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }
  
  if (restaurantName !== '') {
    restaurant.name = restaurantName;

    const updatedRestaurant = await restaurant.save();
    res.status(200).json(updatedRestaurant);
  } else {
    res.status(400).json({ message: 'Restaurant name cannot be empty' });
  }

});

// @desc    Update restaurant logo URL
// @route   PUT /restaurants/:restaurantId/logoUrl
// @access  Private
const updateRestaurantLogoUrl = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { logoUrl } = req.body;

  const updatedRestaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    { logoUrl },
  );
  if (!updatedRestaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  res.status(200).json(updatedRestaurant);
});

// @desc    Update restaurant banner URL
// @route   PUT /restaurants/:restaurantId/bannerUrl
// @access  Private
const updateRestaurantBannerUrl = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { bannerUrl } = req.body;

  const updatedRestaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    { bannerUrl },
  );
  if (!updatedRestaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  res.status(200).json(updatedRestaurant);
});

export { getRestaurantDetails, updateRestaurantName, updateRestaurantLogoUrl, updateRestaurantBannerUrl };