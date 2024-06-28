// models/volunteering.js
const mongoose = require('mongoose');

const volunteeringSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  volunteer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer', required: true },
  application_date: { type: Date, default: Date.now },
  status: { type: String, required: true, enum: ['accepted', 'pending', 'rejected'] }
});

module.exports = mongoose.model('Volunteering', volunteeringSchema);
