// routes/organizations.js
const express = require('express');
const router = express.Router();
const Organization = require('../models/organization');
const { check, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');

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
router.post('/', auth, authorize('organization'),[
  check('name', 'Name is required').isLength({min: 3}),
  check('description', 'Description is required').isLength({min: 5}),
  check('contact_email', 'Description is required').isEmail(),
  check('contact_phone', 'Description is required').not().isEmpty(),
  check('address', 'Description is required').not().isEmpty(),
  check('website', 'Description is required').not().isEmpty(),
],async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }


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

// Get organization by ID
router.get('/:id',  async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ msg: 'Organization not found' });
    }
    res.json(organization);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get organization by User_ID
router.get('/users/:id',  async (req, res) => {
  try {
    const {user_id} = req.params;
    const organization = await Organization.findOne({user_id});
    if (!organization) {
      return res.status(404).json({ msg: 'Organization not found' });
    }
    res.json(organization);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update organization by ID
router.put('/:id', auth, authorize('organization'),[
  check('name', 'Name is required').isLength({min: 3}),
  check('description', 'Description is required').isLength({min: 5}),
  check('contact_email', 'Description is required').isEmail(),
  check('contact_phone', 'Description is required').not().isEmpty(),
  check('address', 'Description is required').not().isEmpty(),
  check('website', 'Description is required').not().isEmpty(),
], async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description,contact_email,contact_phone, address, website } = req.body;

  try {
    let organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({ msg: 'Organization not found' });
    }

    organization.name = name;
    organization.description = description;
    organization.contact_email = contact_email;
    organization.contact_phone = contact_phone;
    organization.address = address;
    organization.website = website;

    organization = await Organization.findByIdAndUpdate(req.params.id, { $set: organization }, { new: true });

    res.json(organization);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete organization by ID
router.delete('/:id', auth, authorize('organization'), async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({ msg: 'Organization not found' });
    }

    await Organization.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Organization removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
