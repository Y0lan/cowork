const User = require('./../models/userModel');
const catchAsynchronousError = require('../utils/catchAsynchronousError');

exports.incrementID = async (req, res, next) => {
  const total = await User.countDocuments();
  req.body._id = total + 1;
  next();
};

exports.signup = catchAsynchronousError(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    user,
  });
});
