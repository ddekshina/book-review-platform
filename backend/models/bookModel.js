// models/bookModel.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A book must have a title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'A book must have an author'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'A book must have a description'],
    trim: true
  },
  coverImage: {
    type: String,
    default: 'default-book.jpg'
  },
  genre: {
    type: [String],
    required: [true, 'A book must have at least one genre']
  },
  publishedYear: {
    type: Number
  },
  publisher: {
    type: String,
    trim: true
  },
  isbn: {
    type: String,
    trim: true,
    unique: true
  },
  totalRating: {
    type: Number,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A book must be added by a user']
  }
});

// Virtual populate to get reviews
bookSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'book',
  localField: '_id'
});

// Middleware to calculate average rating
bookSchema.pre('save', function(next) {
  if (this.ratingCount > 0) {
    this.averageRating = this.totalRating / this.ratingCount;
  }
  next();
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;