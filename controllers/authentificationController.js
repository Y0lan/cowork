const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('./../models/userModel');
const catchAsynchronousError = require('../utils/catchAsynchronousError');
const AppError = require('./../utils/AppError');
const { promisify } = require('util');
const Email = require('./../utils/email');

const signJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signJWT(user._id);
  const cookiesOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers('x-forwarded-proto') === 'https',
  };
  res.cookie('jwt', token, cookiesOption);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsynchronousError(async (req, res, next) => {
  const user = await User.create({
    _id: req.body._id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(user, url).sendWelcome();
  createSendToken(user, 201, req, res);
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

  createSendToken(user, 201, req, res);
});

exports.logout = (req, res) => {
  res.clearCookie('jwt');

  res.status(200).json({
    status: 'success',
  });
};

exports.protect = catchAsynchronousError(async (req, res, next) => {
  // Get the token
  let token = req.headers.authorization || req.cookies.jwt;

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
  res.locals.user = loggedUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have enough permission to perform this.', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsynchronousError(async (req, res, next) => {
  // get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('Email incorrect', 404));

  // generate token
  const resetToken = user.createPasswordResetToken();

  // to accept only the email field in user.save
  await user.save({ validateBeforeSave: false });

  // sent email to user

  try {
    //TODO add a button + form (password forgotten)
    //TODO make a form to change the password that sends the PATCH request to the correct url
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetUrl).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'token sent to email',
    });
  } catch (error) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending the email. Try again later'),
      500
    );
  }
});

exports.resetPassword = catchAsynchronousError(async (req, res, next) => {
  // get user with token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    // check if token has expired
    passwordResetExpires: { $gt: Date.now() },
  });
  // check if there is a user
  if (!user) return next(new AppError('Token is invalid or has expired', 400));
  // reset the password of the user
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // log the user in
  createSendToken(user, 200, req, res);
});

exports.updateMyPassword = catchAsynchronousError(async (req, res, next) => {
  // req.body : {
  // current: "current user password",
  // new : "new user password"
  // }

  // get the user from collection
  const user = await User.findById(req.user.id).select('+password');
  if (!user) return next(new AppError('Incorrect email'), 401);
  // check if the request comes from the owner of the account
  const currentPassword = user.password;
  if (!(await user.correctPassword(req.body.current, currentPassword))) {
    return next(new AppError('Incorrect password.'), 401);
  }
  // update password
  user.password = req.body.new;
  await user.save();
  // log user in
  createSendToken(user, 200, req, res);
});

exports.isLoggedIn = catchAsynchronousError(async (req, res, next) => {
  if (req.cookies.jwt) {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);
    if (!user) return next();
    if (user.changePasswordAfter(decoded.iat)) return next();
    res.locals.user = user;
  }
  next();
});
