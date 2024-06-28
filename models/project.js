// models/project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  organization_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  location: { type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  volunteers_needed: { type: Number, required: true },
  projectPhoto: {
    type: String // URL of the profile photo
  }
});

module.exports = mongoose.model('Project', projectSchema);
