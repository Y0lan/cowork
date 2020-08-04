const AppError = require('./../utils/AppError');
const handleCastErrorDatabase = (error) => {
  const message = `Invalid ${error.path}: ${error.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDatabase = (error) => {
  const field = error.message.match(/"(.*?)"/)[0];
  const message = `Duplicate fields ${field}.`;
  return new AppError(message, 400);
};
handleValidationErrorDatabase = (error) => {
  const errors = Object.values(error.errors).map((element) => element.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error,
    stack: error.stack,
  });
};

const sendErrorProd = (error, res) => {
  // Trusted error made by the user
  if (error.isOperationalError) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
  // Untrusted error, made by the code (my fault!)
  console.error('ERROR: ', error);
  res.status(500).json({
    error: 'error',
    message: 'something went wrong. :(',
  });
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'dev') sendErrorDev(error, res);
  if (process.env.NODE_ENV === 'prod') {
    if (error.name === 'CastError') error = handleCastErrorDatabase(error);
    if (error.code === 11000) error = handleDuplicateFieldsDatabase(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDatabase(error);
    sendErrorProd(error, res);
  }
};
