// backend/controllers/userController.js
const User = require('../models/userModel');
const AppError = require('../utils/appError');

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update user profile
exports.updateUser = async (req, res, next) => {
  try {
    // Check if user is authorized to update this profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return next(
        new AppError('You do not have permission to update this profile', 403)
      );
    }
    
    // Filter out unwanted fields that should not be updated
    const filteredBody = {};
    const allowedFields = ['username', 'email', 'profilePicture', 'bio'];
    
    Object.keys(req.body).forEach((field) => {
      if (allowedFields.includes(field)) {
        filteredBody[field] = req.body[field];
      }
    });
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!updatedUser) {
      return next(new AppError('No user found with that ID', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (err) {
    next(err);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    // Check if user is authorized to delete this profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return next(
        new AppError('You do not have permission to delete this profile', 403)
      );
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};