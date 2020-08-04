const express = require('express');
const app = express();
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const spacesRouter = require('./routes/spaceRoutes');
const usersRouter = require('./routes/userRoutes');
// MIDDLEWARE
app.use(express.json());
if (process.env.NODE_ENV === 'dev') app.use(morgan('dev'));

// ROUTE
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/spaces', spacesRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
