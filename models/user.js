const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['volunteer', 'organization']
  },
  profilePhoto: {
    type: String // URL of the profile photo
  }
});

module.exports = mongoose.model('User', userSchema);
