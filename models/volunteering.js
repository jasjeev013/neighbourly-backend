// models/volunteering.js
const mongoose = require('mongoose');

const volunteeringSchema = new mongoose.Schema({
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  volunteer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer', required: true },
  application_date: { type: Date, default: Date.now },
  status: { type: String, required: true, enum: ['accepted', 'pending', 'rejected'] }
});

module.exports = mongoose.model('Volunteering', volunteeringSchema);
