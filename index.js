// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
const usersRouter = require('./routes/users');
const organizationsRouter = require('./routes/organizations');
const projectsRouter = require('./routes/projects');
const volunteersRouter = require('./routes/volunteers');
const eventsRouter = require('./routes/events');
const reviewsRouter = require('./routes/reviews');
const categoriesRouter = require('./routes/categories');
const locationsRouter = require('./routes/locations');
const volunteeringRouter = require('./routes/volunteering');

app.use('/users', usersRouter);
app.use('/organizations', organizationsRouter);
app.use('/projects', projectsRouter);
app.use('/volunteers', volunteersRouter);
app.use('/events', eventsRouter);
app.use('/reviews', reviewsRouter);
app.use('/categories', categoriesRouter);
app.use('/locations', locationsRouter);
app.use('/volunteering', volunteeringRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
