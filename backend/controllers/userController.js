import asyncHandler from 'express-async-handler';
import Restaurant from '../models/restaurantModel.js';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import nodemailer from 'nodemailer';
import UserResetPassword from '../models/userResetPasswordModel.js';


/**
 * @desc    Auth user & generate a token
 * @route   POST /api/users/auth
 * @access  Public
 * @param req.body.email - email of the user
 * @param req.body.password - password of the user
 * @returns {token: String, _id: String, email: String, role: String, restaurant: String}
 */
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

/**
 * @desc    Request a password reset
 * @route   POST /api/users/password/reset
 * @access  Public
 * @param   req.body.email - email of the user
 * @returns {message: String, requestReset: {Object}}}
 */
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body

  // check if the email exists in the database
  // search db for user by email
  const userExists = await User.findOne({ email });
  // if the user does not exist in the database
  if (!userExists) {
    res.status(400)
    throw new Error('This email is not registered with EzOrder')
  }

  // before we add in a new verification code, we will delete previous password reset attempts, ensuring the user can only reset their password with the most recent verification code
  const previousPasswordReset = await UserResetPassword.find({email: email})

  // if there is and previous requests, then delete them
  previousPasswordReset.forEach(async (element) => {
    await UserResetPassword.deleteOne({_id: element._id})
  });

  // if the email does exist, then send it an email containing verification code (6 digits)
  const verify_code = Math.floor(100000 + Math.random() * 900000);

  // send the email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EZORDER_EMAIL,
      pass: process.env.EZORDER_PASSWORD
    }
  });
  
  const mailOptions = {
    from: process.env.EZORDER_EMAIL,
    to: `${email}`,
    subject: 'Password Reset',
    text: `Hi ${userExists.name},\n\nYou've requested a password reset on your account. Your verification code is: ${verify_code}.\n\nKind regards,\nEzOrder Team`
  };
  
  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      res.status(400).json(error);
    } else {
      // if we get here, then store the verification code with the user email in the database so we can check it when it is used
      const requestReset = await UserResetPassword.create({
          email: userExists.email,
          verification_code: verify_code,
      })
      res.status(201).json({ Message: "Email sent", requestReset });
    }
  });
})

/**
 * @desc   Validate verification code
 * @route  POST /api/users/password/reset/verify
 * @access Public
 * @param  req.body.email - email of the user
 * @param  req.body.verificationCode - verification code sent to the user's email
 * @returns {message: String}
 */
const validateVerificationCode = asyncHandler(async (req, res) => {
  const { email, verificationCode } = req.body
  // check if the email exists in the database
  // search db for user by email
  const userExists = await User.findOne({ email });
  // if the user does not exist in the database
  if (!userExists) {
    res.status(400)
    throw new Error('This email is not registered with EzOrder')
  }

  // get the previous password reset request
  // there should only be one in the database for a user at a time, since everytime a new password reset is requested, the previous is deleted
  const previousPasswordReset = await UserResetPassword.findOne({email: email})
  // the user has not requested for password reset first
  if (!previousPasswordReset) {
    res.status(400)
    throw new Error('You need to request a password reset first')
  }

  // check if the verification code provided is the same in the db
  if (verificationCode !== previousPasswordReset.verification_code) {
    res.status(401) // unauthorised
    throw new Error('The verification code you provided is incorrect')
  }

  res.status(200).json({message: "Verification success"})
})

/**
 * @desc    Reset the password of a user who has already been verified
 * @route   PUT /api/users/password/reset
 * @access  Public
 * @param   req.body.email - email of the user
 * @param   req.body.verification_code - verification code sent to user's email
 * @param   req.body.newPassword - user's new requested password
 * @returns {message: String}
 */
const passwordReset = asyncHandler(async (req, res) => {
  const { email, verification_code, newPassword } = req.body

  // get the previous password reset request
  // there should only be one in the database for a user at a time, since everytime a new password reset is requested, the previous is deleted
  const previousPasswordReset = await UserResetPassword.findOne({email: email})
  // the user has not requested for password reset first
  if (!previousPasswordReset) {
    res.status(400)
    throw new Error('You need to request a password reset first')
  }

  // check if the verification code provided is the same in the db
  if (verification_code !== previousPasswordReset.verification_code) {
    res.status(401) // unauthorised
    throw new Error('The verification code you provided is incorrect')
  }

  // checks completed, store the new password in the database
  // get the user from the User collection model
  const user = await User.findOne({ email });

  // update the password
  user.password = newPassword

  // save the change, this should automatically encrypt the password too from the save method in the user model
  const updatedUser = await user.save()

  // final check, check if the entered password from the body is the same as the password in the database (goes through hashing with bcrypt)
  if (!user.matchPassword(newPassword)) {
    res.status(500)
    throw new Error('Something went wrong with saving the new password into the database')
  }

  // delete the password reset request from database
  await UserResetPassword.deleteOne({_id: previousPasswordReset._id})

  res.status(200).json({message: "Successfully reset password"})
})

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 * @param   req.body.name - the name of the user
 * @param   req.body.email - the email of the user
 * @param   req.body.email - password of the user
 * @param   req.body.restaurantName - name of restaurant of the user
 * @returns {_id: String, name: String, email: String, role: String, restaurant: String}
*/
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

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/users/logout
 * @access  Public
 * @returns {message: String}
 */
const logoutUser = (req, res) => {
  // Frontend should remove userInfo from localStorage
  res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * @desc    Get user details
 * @route   GET /api/users/profile
 * @access  Private
 * @returns {_id: String, name: String, email: String}
 */
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

/**
 * @desc    Get the user details of all users from a specific restaurant
 * @route   GET /api/users/profiles
 * @access  Private
 * @param   req.headers.restaurantId - restaurantId of the user
 * @returns {List: [{id: String, name: String, email: String, role: String}]}
 */
const getUserProfiles = asyncHandler(async (req, res) => {
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
  }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 * @param   req.body.id - object id of the user
 * @param   req.body.name - name of the user
 * @param   req.body.email - email of the user
 * @param   req.body.password - password of the user
 * @returns {_id: String, name: String, email: String}
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.id);
  const { name, email, password } = req.body;

  if (email != '' && email != user.email) {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('Email address already used');
    }
  }

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      user.password = password;
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

/**
 * @desc    Update user profile of a staff member
 * @route   PUT /api/users/editStaff
 * @access  Private
 * @param   req.body.id - id of the user
 * @param   req.body.name - name of the user
 * @param   req.body.email - email of the user
 * @param   req.body.role - role of the user
 * @param   req.body.password - password of the user
 * @returns {_id: String, name: String, email: String, role: String}
 */
const updateStaffProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private
 * @param   req.headers._id - id of user deleting
 * @param   req.params.id - id of the user to delete
 * @returns 200 status code
 */
const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(403);
    throw new Error('Did not receive id in params');
  }

  if (req.headers._id == id) {
    res.status(400);
    throw new Error('Cannot delete user');
  }

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return; // or throw an error
    }
    res.status(200);
  } catch (error) {
  }
});

/**
 * @desc    Register a new user (automatically a manager)
 * @route   POST /api/users/registerStaff
 * @access  Public
 * @param   req.body.name - name of the user
 * @param   req.body.email - email of the user
 * @param   req.body.password - password of the user
 * @param   req.body.role - role of the user
 * @returns {_id: String, name: String, email: String, role: String, restaurant: String}
 */
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
  }
});

/**
 * @desc    Get restaurant details
 * @route   GET /api/users/restaurant
 * @access  Private
 * @returns {{_id: String, name: String, __v: number}}
 */
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
  requestPasswordReset,
  validateVerificationCode,
  passwordReset,
  updateStaffProfile,
};
