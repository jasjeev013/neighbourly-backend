const express = require('express');
const router = express.Router();

const upload = require('../config/multer');
const User = require('../models/user');
const { auth, authorize } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Update user profile
router.put('/', auth, upload.single('profilePhoto'),[
   check('username', 'Username is required').isLength({min: 3}),
   check('email', 'Please include a valid email').isEmail(),
] ,async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }


  const { username, email } = req.body;
  const profilePhoto = req.file ? req.file.path : null;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (profilePhoto) user.profilePhoto = profilePhoto;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get profile of the logged-in user
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
