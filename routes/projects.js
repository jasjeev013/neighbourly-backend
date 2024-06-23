const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const { auth, authorize } = require('../middleware/auth');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new project (protected for organization role)
router.post('/', auth, authorize('organization'), async (req, res) => {
  const project = new Project({
    organization_id: req.user.id,
    title: req.body.title,
    description: req.body.description,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    location_id: req.body.location_id,
    category_id: req.body.category_id,
    volunteers_needed: req.body.volunteers_needed
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
