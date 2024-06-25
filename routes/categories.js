// routes/categories.js
const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const { auth, authorize } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Create a new category
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const category = new Category({
    name: req.body.name
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update category by ID
router.put('/:id', [
  check('name', 'Name is required').not().isEmpty(),
], async (req, res) => { 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;

  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    category.name = name;
    category = await Category.findByIdAndUpdate(req.params.id, { $set: category }, { new: true });

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete category by ID
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    await Category.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



module.exports = router;
