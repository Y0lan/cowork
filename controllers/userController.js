const User = require('../models/userModel');
const catchAsynchronousError = require('./../utils/catchAsynchronousError')
exports.getAllUsers = catchAsynchronousError(async (req, res, next) => {
  const users = await User.find({});
  res.status(500).json({
    status: 'success',
    length: users.length,
    users,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined!',
  });
};

exports.getOneUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined!',
  });
};

exports.deleteOneUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined!',
  });
};

exports.modifyOneUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined!',
  });
};
