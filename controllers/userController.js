const User = require('../models/userModel');
const AppError = require('./../utils/AppError');
const catchAsynchronousError = require('./../utils/catchAsynchronousError');

const filterObject = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach((element) => {
    if (allowedFields.includes(element)) {
      newObject[element] = obj[element];
    }
  });
  return newObject;
};

exports.getAllUsers = catchAsynchronousError(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    status: 'success',
    length: users.length,
    users,
  });
});

exports.updateMe = catchAsynchronousError(async (req, res, next) => {
  // create error if user try to update password
  if (req.body.password) {
    return next(
      new AppError('can not update password here, use /updateMyPassword', 400)
    );
  }

  // filter body object
  req.body = filterObject(req.body, 'name', 'email');
  // update the user document
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    }
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
