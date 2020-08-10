const User = require('../models/userModel');
const AppError = require('./../utils/AppError');
const catchAsynchronousError = require('./../utils/catchAsynchronousError');
exports.getAllUsers = catchAsynchronousError(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    status: 'success',
    length: users.length,
    users,
  });
});

exports.updateMe = (req, res, next) => {
  // create error if user try to update password
  if(req.body.password) {
    return next(new AppError("can not update password here", 400))
  }
  // update the user document
  res.status(200).json({
    status: 'success'
  })

}

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
