const User = require('../models/userModel');
const Space = require('./../models/spaceModel');
const AppError = require('./../utils/AppError');
const catchAsynchronousError = require('./../utils/catchAsynchronousError');
const isIDValid = require('./../utils/isIDValid');
const factory = require('./handlerFactory');

const filterObject = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach((element) => {
    if (allowedFields.includes(element)) {
      newObject[element] = obj[element];
    }
  });
  return newObject;
};

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
    },
  });
});

exports.deleteMe = catchAsynchronousError(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllMentors = catchAsynchronousError(async (req, res, next) => {
  const users = await User.find({ role: 'mentor' });
  if (!users) {
    return next(new AppError('There is no mentor', 400));
  }
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
});

exports.makeMentor = catchAsynchronousError(async (req, res, next) => {
  // make mentor
  const user = await User.findByIdAndUpdate(
    req.params.userID,
    {
      role: 'mentor',
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new AppError('Could not change role to mentor', 400));
  }

  // add mentor to space
  const space = await Space.findById(req.params.spaceID);

  if (!space) {
    return next(
      new AppError('Could not add mentor to space but user was updated', 400)
    );
  }
  space.mentors.push(req.params.id);
  space.save();
  res.status(200).json({
    status: 'success',
    data: {
      user,
      space,
    },
  });
});

exports.makeUser = catchAsynchronousError(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      role: 'user',
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new AppError('Could not change role to user', 400));
  }

  const space = await Space.find({}); // TODO ???

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getAllUser = factory.getAll(User);
exports.getOneUser = factory.getOne(User);
exports.deleteOneUser = factory.deleteOne(User);
exports.updateOneUser = factory.updateOne(User);
exports.isIDValid = isIDValid(User);
