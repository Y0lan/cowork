const express = require('express');
const fs = require('fs');
const app = express();
const morgan = require('morgan');

const spacesRouter = require('./routes/spaceRoutes');
const usersRouter = require('./routes/userRoutes');
// MIDDLEWARE
app.use(express.json());
if (process.env.NODE_ENV === 'dev') app.use(morgan('dev'));

// ROUTE
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/spaces', spacesRouter);

module.exports = app;
