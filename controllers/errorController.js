const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

const sendErrorProd = (error, res) => {
  // Trusted error made by the user
  if(error.isOperationalError) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
  // Untrusted error, made by the code (my fault!)
  console.error('ERROR: ', error)
  res.status(500).json({
    error: 'error',
    message: 'something went wrong. :('
  })
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'dev') sendErrorDev(error, res);
  if (process.env.NODE_ENV === 'prod') sendErrorProd(error, res);
};
