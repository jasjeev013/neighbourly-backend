// routes/reviews.js
const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const { auth, authorize } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

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
router.post('/', auth, authorize('volunteer'),[
  check('volunteer_id', 'Volunteer ID is required').not().isEmpty(),
  check('project_id', 'Project ID is required').not().isEmpty(),
  check('rating', 'Rating is required').isInt({ min: 1, max: 5 }),
  check('comment', 'Comment is required').not().isEmpty(),

] ,async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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

// Get review by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update review by ID
router.put('/:id', auth, authorize('volunteer'),[
  check('volunteer_id', 'Volunteer ID is required').not().isEmpty(),
  check('project_id', 'Project ID is required').not().isEmpty(),
  check('rating', 'Rating is required').isInt({ min: 1, max: 5 }),
  check('comment', 'Comment is required').not().isEmpty(),

] , async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rating, comment } = req.body;

  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    review.rating = rating;
    review.comment = comment;

    review = await Review.findByIdAndUpdate(req.params.id, { $set: review }, { new: true });

    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete review by ID
router.delete('/:id', auth, authorize('volunteer'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    await Review.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Review removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
