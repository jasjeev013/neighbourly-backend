// models/location.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip_code: { type: String, required: true },
});

module.exports = mongoose.model('Location', locationSchema);
