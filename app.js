const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const spacesRouter = require('./routes/spaceRoutes');
const usersRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARE

// set security HTTP headers
app.use(helmet());

// limit request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

// body and response management
app.use(
  express.json({
    limit: '10kb',
  })
);

// data sanitization against NOSQL query injection
app.use(mongoSanitize());
// data sanitization against cross site scripting attack
app.use(xss());
// prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);

// serving static files
app.use(express.static(`${__dirname}/public`));
if (process.env.NODE_ENV === 'dev') app.use(morgan('dev'));

// ROUTE
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/spaces', spacesRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
