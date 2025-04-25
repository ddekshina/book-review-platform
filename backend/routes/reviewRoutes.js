// backend/routes/reviewRoutes.js
const express = require('express');
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', reviewController.getReviews);
router.get('/:id', reviewController.getReviewById);

// Protected routes - authentication required
router.use(protect);

router.post('/', reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);
router.post('/:id/refine', reviewController.refineReview);

module.exports = router;