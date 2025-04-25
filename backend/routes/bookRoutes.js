// backend/routes/bookRoutes.js
const express = require('express');
const bookController = require('../controllers/bookController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/featured', bookController.getFeaturedBooks);
router.get('/:id', bookController.getBookById);

// Protected routes - authentication required
router.use(protect);

// Admin only routes
router.post('/', restrictTo('admin'), bookController.createBook);
router.put('/:id', restrictTo('admin'), bookController.updateBook);
router.delete('/:id', restrictTo('admin'), bookController.deleteBook);

module.exports = router;