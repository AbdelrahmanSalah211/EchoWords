require('dotenv').config();
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const { AppError } = require("../utils/AppError.js");

const authenticateUser = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access', 401));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exits', 401));
    }
    req.user = currentUser;
    next();
  }
}

module.exports = authenticateUser;