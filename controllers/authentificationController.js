const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsynchronousError = require('../utils/catchAsynchronousError');
const AppError = require('./../utils/AppError');
const { promisify } = require('util');

exports.incrementID = async (req, res, next) => {
  const total = await User.countDocuments();
  req.body._id = total + 1;
  next();
};

const signJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsynchronousError(async (req, res, next) => {
  const user = await User.create({
    _id: req.body._id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = signJWT(user._id);

  res.status(201).json({
    status: 'success',
    token,
    user,
  });
});

exports.login = catchAsynchronousError(async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email sent
  if (!email) return next(new AppError('Please, provide your email.', 400));

  // Check if password sent
  if (!password)
    return next(new AppError('Please, provide your password.', 400));

  // Check if a User with this email exist
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new AppError('Incorrect email'), 401);

  // Check if the password is correct for this email
  const correctPassword = await user.correctPassword(password, user.password);
  if (!correctPassword) return next(new AppError('Incorrect password'), 401);

  const token = signJWT(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsynchronousError(async (req, res, next) => {
  // Get the token
  let token = req.headers.authorization;

  // Check if the token exist
  if (!token) {
    return next(new AppError('You need to be logged in.', 401));
  }
  if (token && token.startsWith('Bearer')) {
    token = token.split(' ')[1];
  }
  // Validate the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // Check if user still exists
  const loggedUser = await User.findById(decoded.id);
  if (!loggedUser) {
    return next(
      new AppError('The user you try to log in does not exist.'),
      401
    );
  }
  // Check if user changed password after the token was issued
  // iat : issued at
  if (loggedUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'Invalid token, you must have modified your password recently.',
        401
      )
    );
  }
  // get access to protected route
  req.user = loggedUser;
  next();
});
