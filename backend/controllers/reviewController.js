// backend/controllers/reviewController.js
const Review = require('../models/reviewModel');
const Book = require('../models/bookModel');
const AppError = require('../utils/appError');

// Get all reviews for a book
exports.getReviews = async (req, res, next) => {
  try {
    let filter = {};
    
    if (req.query.bookId) {
      filter = { book: req.query.bookId };
    }
    
    const reviews = await Review.find(filter)
      .populate({
        path: 'user',
        select: 'username profilePicture'
      })
      .sort('-createdAt');
    
    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: {
        reviews
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get a single review
exports.getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate({
      path: 'user',
      select: 'username profilePicture'
    });
    
    if (!review) {
      return next(new AppError('No review found with that ID', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        review
      }
    });
  } catch (err) {
    next(err);
  }
};

// Create a new review
exports.createReview = async (req, res, next) => {
  try {
    // Check if book exists
    const book = await Book.findById(req.body.book);
    if (!book) {
      return next(new AppError('No book found with that ID', 404));
    }
    
    // Add user ID to request body
    req.body.user = req.user._id;
    
    // If no finalReview is provided, use the original review
    if (!req.body.finalReview) {
      req.body.finalReview = req.body.review;
    }
    
    const newReview = await Review.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        review: newReview
      }
    });
  } catch (err) {
    // Handle duplicate review error
    if (err.code === 11000) {
      return next(new AppError('You have already reviewed this book', 400));
    }
    next(err);
  }
};

// Update a review
exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return next(new AppError('No review found with that ID', 404));
    }
    
    // Check if user is the owner of the review
    if (review.user.toString() !== req.user._id.toString()) {
      return next(
        new AppError('You do not have permission to update this review', 403)
      );
    }
    
    // If no finalReview is provided, use the original review
    if (req.body.review && !req.body.finalReview) {
      req.body.finalReview = req.body.review;
    }
    
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        review: updatedReview
      }
    });
  } catch (err) {
    next(err);
  }
};

// Delete a review
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return next(new AppError('No review found with that ID', 404));
    }
    
    // Check if user is the owner of the review or an admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(
        new AppError('You do not have permission to delete this review', 403)
      );
    }
    
    await Review.findByIdAndDelete(req.params.id);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

// For now, let's implement a placeholder for the AI refinement feature
// We'll implement the full version later with the bonus task
exports.refineReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return next(new AppError('No review found with that ID', 404));
    }
    
    // Check if user is the owner of the review
    if (review.user.toString() !== req.user._id.toString()) {
      return next(
        new AppError('You do not have permission to refine this review', 403)
      );
    }
    
    // Placeholder response - we'll implement the AI integration later
    res.status(200).json({
      status: 'success',
      message: 'AI refinement will be implemented in the bonus task',
      data: {
        review
      }
    });
  } catch (err) {
    next(err);
  }
};