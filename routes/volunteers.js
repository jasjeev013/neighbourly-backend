// routes/volunteers.js
const express = require('express');
const router = express.Router();
const Volunteer = require('../models/volunteer');
const { auth, authorize } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Get all volunteers
router.get('/',auth ,async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new volunteer
router.post('/',auth, authorize('volunteer'),[
  check('user_id', 'User ID is required').not().isEmpty(),
  check('bio', 'Bio is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty(),
  check('availability', 'Availability is required').not().isEmpty()

] ,async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const volunteer = new Volunteer({
    user_id: req.body.user_id,
    bio: req.body.bio,
    skills: req.body.skills,
    availability: req.body.availability
  });

  try {
    const newVolunteer = await volunteer.save();
    res.status(201).json(newVolunteer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get volunteer by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ msg: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get volunteer by User_ID
router.get('/users/:user_id', auth, async (req, res) => {
  try {
    const {user_id} = req.params ;
    const volunteer = await Volunteer.findOne({user_id});
    if (!volunteer) {
      return res.status(404).json({ msg: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update volunteer by ID
router.put('/:id',auth, authorize('volunteer'),[
  check('user_id', 'User ID is required').not().isEmpty(),
  check('bio', 'Bio is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty(),
  check('availability', 'Availability is required').not().isEmpty()

] , async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { bio, skills, availability } = req.body;

  try {
    let volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({ msg: 'Volunteer not found' });
    }

    volunteer.bio = bio;
    volunteer.skills = skills;
    volunteer.availability = availability;

    volunteer = await Volunteer.findByIdAndUpdate(req.params.id, { $set: volunteer }, { new: true });

    res.json(volunteer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete volunteer by ID
router.delete('/:id', auth, authorize('volunteer'), async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({ msg: 'Volunteer not found' });
    }

    await Volunteer.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Volunteer removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



module.exports = router;
