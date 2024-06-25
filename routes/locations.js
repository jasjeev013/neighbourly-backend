// routes/locations.js
const express = require('express');
const router = express.Router();
const Location = require('../models/location');
const { auth, authorize } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new location
router.post('/', auth, authorize('organization'), [
  check('address', 'Address is required').not().isEmpty(),
  check('city', 'City is required').not().isEmpty(),
  check('state', 'State is required').not().isEmpty(),
  check('zip_code', 'Zip Code is required').not().isEmpty(),
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const location = new Location({
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    zip_code: req.body.zip_code
  });

  try {
    const newLocation = await location.save();
    res.status(201).json(newLocation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Get location by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ msg: 'Location not found' });
    }
    res.json(location);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update location by ID
router.put('/:id', auth, authorize('organization'), [
  check('address', 'Address is required').not().isEmpty(),
  check('city', 'City is required').not().isEmpty(),
  check('state', 'State is required').not().isEmpty(),
  check('zip_code', 'Zip Code is required').not().isEmpty(),
],  async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { city, address, state, zip_code } = req.body;

  try {
    let location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ msg: 'Location not found' });
    }

    location.address = address;
    location.city = city;
    location.state = state;
    location.zip_code = zip_code;

    location = await Location.findByIdAndUpdate(req.params.id, { $set: location }, { new: true });

    res.json(location);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete location by ID
router.delete('/:id',  auth, authorize('organization'), async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ msg: 'Location not found' });
    }

    await Location.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Location removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
 

module.exports = router;
