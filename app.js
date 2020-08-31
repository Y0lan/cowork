const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const spacesRouter = require('./routes/spaceRoutes');
const usersRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewsRouter = require('./routes/viewsRoutes');
const subscriptionRouter = require('./routes/subscriptionsRoute');

const app = express();
app.enable('trust proxy');

app.enable('trust proxy');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// MIDDLEWARE
app.use(cors());
//app.options('*', cors());
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
app.use(cookieParser());
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

app.use(compression());

if (process.env.NODE_ENV === 'dev') app.use(morgan('dev'));

// ROUTE

app.use('/', viewsRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/spaces', spacesRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
