// routes/volunteering.js
const express = require('express');
const router = express.Router();
const Volunteering = require('../models/volunteering');
const { auth, authorize } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');


// Get all volunteering applications
router.get('/',auth, authorize('organization'), async (req, res) => {
  try {
    const volunteeringApplications = await Volunteering.find();
    res.json(volunteeringApplications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all volunteering applications by event_id
router.get('/events/:event_id',auth, authorize('organization'), async (req, res) => {
  try {
    const {event_id} = req.params;
    const volunteeringApplications = await Volunteering.find({event_id});
    res.json(volunteeringApplications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all volunteering applications by volunteer_id
router.get('/volunteers/:volunteer_id',auth, authorize('organization'), async (req, res) => {
  try {
    const {volunteer_id} = req.params;
    const volunteeringApplications = await Volunteering.find({volunteer_id});
    res.json(volunteeringApplications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new volunteering application
router.post('/',auth, authorize('volunteer'),[
  check('event_id', 'Event ID is required').not().isEmpty(),
  check('volunteer_id', 'Volunteer ID is required').not().isEmpty(),
  check('status', 'Status is required').not().isEmpty()

] ,async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const volunteering = new Volunteering({
    event_id: req.body.event_id,
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

// Get volunteering opportunity by ID
router.get('/:id', auth, authorize('organization'), async (req, res) => {
  try {
    const volunteering = await Volunteering.findById(req.params.id);
    if (!volunteering) {
      return res.status(404).json({ msg: 'Volunteering opportunity not found' });
    }
    res.json(volunteering);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Delete volunteering opportunity by ID
router.delete('/:id',auth, authorize('organization'),  async (req, res) => {
  try {
    const volunteering = await Volunteering.findById(req.params.id);

    if (!volunteering) {
      return res.status(404).json({ msg: 'Volunteering opportunity not found' });
    }

    await Volunteering.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Volunteering opportunity removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
