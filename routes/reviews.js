// routes/reviews.js
const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const { auth, authorize } = require('../middleware/auth');

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new review
router.post('/', auth, authorize('volunteer'), async (req, res) => {
  const review = new Review({
    volunteer_id: req.body.volunteer_id,
    project_id: req.body.project_id,
    rating: req.body.rating,
    comment: req.body.comment
  });

  try {
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
