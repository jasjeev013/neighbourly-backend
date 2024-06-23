// routes/volunteering.js
const express = require('express');
const router = express.Router();
const Volunteering = require('../models/volunteering');

// Get all volunteering applications
router.get('/', async (req, res) => {
  try {
    const volunteeringApplications = await Volunteering.find();
    res.json(volunteeringApplications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new volunteering application
router.post('/', async (req, res) => {
  const volunteering = new Volunteering({
    project_id: req.body.project_id,
    volunteer_id: req.body.volunteer_id,
    status: req.body.status
  });

  try {
    const newVolunteering = await volunteering.save();
    res.status(201).json(newVolunteering);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
