const User = require('../models/userModel.js');
const { AppError } = require("../utils/AppError.js");
const jwt = require('jsonwebtoken');

const userController = {
  signUp: async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
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
    } catch (error) {
      console.error("Error creating user: ", error);
      return next(new AppError('Internal server error', 500));
    }
  },

  login: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user){
        return next(new AppError('Invalid email or password', 401));
      }
      const isPasswordCorrect = await user.correctPassword(password, user.password);
      if (!isPasswordCorrect) {
        return next(new AppError('Invalid email or password', 401));
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });
      return res.status(200).json({
        status: 'success',
        accessToken: token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error("Error logging in user: ", error);
      return next(new AppError('Internal server error', 500));
    }
  },

  updateUser: async (res, req, next) => {
    const { username, email, photo } = req.body;
    const userId = req.user.id;
    try {
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
    } catch (error) {
      console.error("Error updating user: ", error);
      return next(new AppError('Internal server error', 500));
    }
  },

  deleteUser: async (res, req, next) => {
    const userId = req.user.id;
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return next(new AppError('User not deleted', 404));
      }
      return res.status(200).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      console.error("Error deleting user: ", error);
      return next(new AppError('Internal server error', 500));
    }
  },

  updatePassword: async (res, req, next) => {
    const { password, newPassword } = req.body;
    const userId = req.user.id;
    try {
      const user = await User.findById(userId).select('+password');
      if (!user) {
        return next(new AppError('User not found', 404));
      }
      const isPasswordCorrect = await user.correctPassword(password, user.password);
      if (!isPasswordCorrect) {
        return next(new AppError('Incorrect password', 401));
      }
      user.password = newPassword;
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });
      return res.status(200).json({
        status: 'success',
        token
      });
    } catch (error) {
      console.error("Error updating password: ", error);
      return next(new AppError('Internal server error', 500));
    }
  },

  forgetPassword: async (req, res, next) => {
    // const { email } = req.body;
  },

  resetPassword: async (req, res, next) => {
    // const { email } = req.body;
  },
}


module.exports = userController;