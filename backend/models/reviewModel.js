// models/reviewModel.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review cannot be empty'],
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'A review must have a rating']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
    required: [true, 'Review must belong to a book']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  },
  aiRefinedReview: {
    type: String,
    default: null
  },
  finalReview: {
    type: String,
    default: null
  }
});

// Prevent duplicate reviews from the same user for the same book
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

// Static method to calculate average rating and update book
reviewSchema.statics.calcAverageRatings = async function(bookId) {
  const stats = await this.aggregate([
    {
      $match: { book: bookId }
    },
    {
      $group: {
        _id: '$book',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        totalRating: { $sum: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Book').findByIdAndUpdate(bookId, {
      ratingCount: stats[0].nRating,
      averageRating: stats[0].avgRating,
      totalRating: stats[0].totalRating
    });
  } else {
    await mongoose.model('Book').findByIdAndUpdate(bookId, {
      ratingCount: 0,
      averageRating: 0,
      totalRating: 0
    });
  }
};

// Call calcAverageRatings after save
reviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.book);
});

// Get book and user info before updating review
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.clone().findOne();
  next();
});

// Call calcAverageRatings after update or delete
reviewSchema.post(/^findOneAnd/, async function() {
  if (this.r) await this.r.constructor.calcAverageRatings(this.r.book);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;