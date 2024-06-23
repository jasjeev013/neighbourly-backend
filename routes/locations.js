// routes/locations.js
const express = require('express');
const router = express.Router();
const Location = require('../models/location');

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
router.post('/', async (req, res) => {
  const location = new Location({
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    zip_code: req.body.zip_code,
    latitude: req.body.latitude,
    longitude: req.body.longitude
  });

  try {
    const newLocation = await location.save();
    res.status(201).json(newLocation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
