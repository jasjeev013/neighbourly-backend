// models/event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  event_date: { type: Date, required: true },
  location: { type: String, required: true},
  eventPhoto: {
    type: String // URL of the profile photo
  }
});

module.exports = mongoose.model('Event', eventSchema);
