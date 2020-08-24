const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const spacesRouter = require('./routes/spaceRoutes');
const usersRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewsRouter = require('./routes/viewsRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// MIDDLEWARE

// set security HTTP headers
app.use(helmet());

// limit request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1h
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

if (process.env.NODE_ENV === 'dev') app.use(morgan('dev'));

// ROUTE

app.use('/', viewsRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/spaces', spacesRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
