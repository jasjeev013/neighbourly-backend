// routes/volunteers.js
const express = require('express');
const router = express.Router();
const Volunteer = require('../models/volunteer');

// Get all volunteers
router.get('/', async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new volunteer
router.post('/', async (req, res) => {
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

module.exports = router;
