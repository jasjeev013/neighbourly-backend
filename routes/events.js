// routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const { auth, authorize } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all events by project_id
router.get('/projects/:project_id', async (req, res) => {
  try {
    const {project_id} = req.params;
    const events = await Event.find({project_id});
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new event
router.post('/', auth, authorize('organization'),[
  check('project_id', 'Project_ID is required').not().isEmpty(),
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('event_date', 'Date is required').isDate(),
  check('location', 'Date is required').not().isEmpty(),
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  
  const event = new Event({
    project_id: req.body.project_id,
    title: req.body.title,
    description: req.body.description,
    event_date: req.body.event_date,
    location: req.body.location,
    eventPhoto: req.body.eventPhoto
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Update event by ID
router.put('/:id', auth, authorize('organization'), [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('date', 'Date is required').isDate(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, date, location,eventPhoto } = req.body;

  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    event.title = title;
    event.description = description;
    event.date = date;
    event.location = location;
    event.eventPhoto = eventPhoto;

    event = await Event.findByIdAndUpdate(req.params.id, { $set: event }, { new: true });

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete event by ID
router.delete('/:id',  auth, authorize('organization'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    await Event.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
