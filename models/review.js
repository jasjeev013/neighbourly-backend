// models/review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  volunteer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer', required: true },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  review_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
