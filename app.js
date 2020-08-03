const express = require('express');
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

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  })
})

module.exports = app;
