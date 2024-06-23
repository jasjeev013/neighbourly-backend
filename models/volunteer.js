// models/volunteer.js
const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String, required: true },
  skills: [String],
  availability: [String]
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
