const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const User = require('../models/user');
const { auth, authorize } = require('../middleware/auth');

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_photos',
    allowed_formats: ['jpg', 'png','jpeg'],
  },
});

const upload = multer({ storage: storage });

// Create a new user
router.post('/', upload.single('profilePhoto'), [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').not().isEmpty(),
  check('role', 'Role is required and should be either volunteer or organization').isIn(['volunteer', 'organization'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, role } = req.body;
  const profilePhoto = req.file ? req.file.path : '';

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    user = new User({
      username,
      email,
      password,
      role,
      profilePhoto,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});


// Update user by ID
router.put('/:id', auth , upload.single('profilePhoto'), [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').not().isEmpty(),
  check('role', 'Role is required and should be either volunteer or organization').isIn(['volunteer', 'organization'])
], async (req, res) => {
  const { username, email, password, role } = req.body;
  const profilePhoto = req.file ? req.file.path : '';

  // Build user object
  const userFields = {};
  if (username) userFields.username = username;
  if (email) userFields.email = email;
  if (password) userFields.password = password;
  if (role) userFields.role = role;
  if (profilePhoto) userFields.profilePhoto = profilePhoto;

  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      userFields.password = await bcrypt.hash(password, salt);
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});


// Delete user by ID
router.delete('/:id', auth ,async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await User.findByIdAndRemove(req.params.id);

    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
