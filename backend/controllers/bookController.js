// backend/controllers/bookController.js
const Book = require('../models/bookModel');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// Get all books with pagination and filtering
exports.getAllBooks = async (req, res, next) => {
    try {
      // Execute query with API Features
      const features = new APIFeatures(Book.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      
      const books = await features.query;
      
      // Count total documents for pagination info (without pagination)
      const countFeatures = new APIFeatures(Book.find(), req.query).filter();
      const total = await Book.countDocuments(countFeatures.query);
      
      res.status(200).json({
        status: 'success',
        results: books.length,
        total,
        data: {
          books
        }
      });
    } catch (err) {
      next(err);
    }
  };

// Get a single book by ID
exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate({
      path: 'reviews',
      select: 'review rating createdAt user'
    });
    
    if (!book) {
      return next(new AppError('No book found with that ID', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        book
      }
    });
  } catch (err) {
    next(err);
  }
};

// Create a new book (admin only)
exports.createBook = async (req, res, next) => {
  try {
    // Add current user as creator
    req.body.createdBy = req.user._id;
    
    const newBook = await Book.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        book: newBook
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update a book (admin only)
exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!book) {
      return next(new AppError('No book found with that ID', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        book
      }
    });
  } catch (err) {
    next(err);
  }
};

// Delete a book (admin only)
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    
    if (!book) {
      return next(new AppError('No book found with that ID', 404));
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

// Get featured books
exports.getFeaturedBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ featured: true }).limit(6);
    
    res.status(200).json({
      status: 'success',
      results: books.length,
      data: {
        books
      }
    });
  } catch (err) {
    next(err);
  }
};