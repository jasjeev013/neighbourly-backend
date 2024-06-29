const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const { auth, authorize } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all projects under organization_id
router.get('/organizations/:organization_id', async (req, res) => {
  try {
    const {organization_id} = req.params;
    const projects = await Project.find({"organization_id":organization_id});
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new project (protected for organization role)
router.post('/', auth, authorize('organization'),[
  check('organization_id', 'Organization_id should not be empty').not().isEmpty(),
  check('title', 'mTitle should be min. 3 Characters').isLength({ min: 3 }),
  check('description', 'Description should not be empty').isLength({ min: 3 }),
  check('start_date', 'Start Date should not be empty').isDate(),
  check('end_date', 'End Date should not be empty').isDate(),
  check('location', 'Location  should not be empty').not().isEmpty(),
  check('category_id', 'Category Id must be 6 or more characters').not().isEmpty(),
  check('volunteers_needed', 'Volunteers should not be empty').not().isEmpty(),
] ,async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const project = new Project({
    organization_id: req.body.organization_id,
    title: req.body.title,
    description: req.body.description,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    location: req.body.location,
    category_id: req.body.category_id,
    volunteers_needed: req.body.volunteers_needed,
    projectPhoto: req.body.projectPhoto
  });

  

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update project by ID
router.put('/:id', auth, authorize('organization'),[
  check('title', 'Title should be min. 3 Characters').isLength({ min: 3 }),
  check('description', 'Description should not be empty').isLength({ min: 3 }),
  check('location', 'Location should not be empty').not().isEmpty(),
  check('start_date', 'Start Date should not be empty').isDate(),
  check('end_date', 'End Date should not be empty').isDate(),
  check('volunteers_needed', 'Volunteers should not be empty').not().isEmpty(),
] , async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, startDate, endDate,volunteers_needed,location ,projectPhoto} = req.body;

  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    project.title = title;
    project.description = description;
    project.startDate = startDate;
    project.endDate = endDate;
    project.volunteers_needed = volunteers_needed;
    project.projectPhoto = projectPhoto;
    project.location = location;

    project = await Project.findByIdAndUpdate(req.params.id, { $set: project }, { new: true });

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete project by ID
router.delete('/:id',  auth, authorize('organization'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    await Project.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
