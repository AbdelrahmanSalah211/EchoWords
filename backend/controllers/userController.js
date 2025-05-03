const User = require('../models/userModel.js');
const { AppError } = require("../utils/AppError.js");
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync.js');

const userController = {
  signUp: catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;
    const newUser = await User.create({
      username,
      email,
      password
    });
    if (!newUser) {
      return next(new AppError('User not created', 400));
    }
    return res.status(201).json({
      status: 'success',
      message: 'User created successfully'
    });
  }),

  login: catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user){
      return next(new AppError('Invalid email or password', 401));
    }
    const isPasswordCorrect = await user.correctPassword(password, user.password);
    if (!isPasswordCorrect) {
      return next(new AppError('Invalid email or password', 401));
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
    });

    const refreshToken = jwt.sign( { userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
      maxAge: process.env.MAX_AGE * 1000
    });

    return res.status(200).json({
      status: 'success',
      accessToken: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        photo: user.photo
      }
    });
  }),

  refreshToken: catchAsync(async (req, res, next) => {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      return next(new AppError('No refresh token found', 401));
    }

    const decoded = await promisify(jwt.verify)(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const accessToken = jwt.sign( { userId: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN });

    return res.status(200).json({
      status: 'success',
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        photo: user.photo
      }
    });
  }),

  logout: catchAsync(async (req, res, next) => {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });
    return res.status(200).json({
      status: 'success',
      message: 'Successfully logged out'
    });
  }),

  updateUser: catchAsync(async (req, res, next) => {
    const { username, email, photo } = req.body;
    const userId = req.user.id;
    const updatedUser = await User.findByIdAndUpdate(userId, {
      username,
      email,
      photo
    },
    {
      new: true,
      runValidators: true
    });
    if (!updatedUser) {
      return next(new AppError('User not updated', 404));
    }
    return res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  }),

  deleteUser: catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return next(new AppError('User not deleted', 404));
    }
    return res.status(200).json({
      status: 'success',
      data: null
    });
  }),

  updatePassword: catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    const isPasswordCorrect = await user.correctPassword(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return next(new AppError('Incorrect password', 401));
    }
    user.password = newPassword;
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
    });
    return res.status(200).json({
      status: 'success',
      token
    });
  }),

  forgetPassword: async (req, res, next) => {
    // const { email } = req.body;
  },

  resetPassword: async (req, res, next) => {
    // const { email } = req.body;
  },
}


module.exports = userController;