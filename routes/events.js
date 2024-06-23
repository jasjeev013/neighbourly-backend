// routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const { auth, authorize } = require('../middleware/auth');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new event
router.post('/', auth, authorize('organization'), async (req, res) => {
  const event = new Event({
    project_id: req.body.project_id,
    title: req.body.title,
    description: req.body.description,
    event_date: req.body.event_date,
    location_id: req.body.location_id
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
