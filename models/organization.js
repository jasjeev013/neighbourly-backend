// models/organization.js
const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  contact_email: { type: String, required: true },
  contact_phone: { type: String, required: true },
  address: { type: String, required: true },
  website: { type: String }
});

module.exports = mongoose.model('Organization', organizationSchema);
