// routes/organizations.js
const express = require('express');
const router = express.Router();
const Organization = require('../models/organization');

// Get all organizations
router.get('/', async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.json(organizations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new organization
router.post('/', async (req, res) => {
  const organization = new Organization({
    user_id: req.body.user_id,
    name: req.body.name,
    description: req.body.description,
    contact_email: req.body.contact_email,
    contact_phone: req.body.contact_phone,
    address: req.body.address,
    website: req.body.website
  });

  try {
    const newOrganization = await organization.save();
    res.status(201).json(newOrganization);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
