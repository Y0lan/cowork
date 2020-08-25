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
  const mentorID = req.params.mentorID;
  const spaceID = req.params.spaceID;

  // make mentor

  // obliger de passer spaceID en params et pas en body
  // pour utiliser le middleware isIDValid
  // C'est plus simple.

  const space = await Space.findById(req.params.spaceID);

  if (!space) {
    return next(new AppError('Could not find a Space', 400));
  }

  const mentor = await User.findByIdAndUpdate(
    mentorID,
    {
      role: 'mentor',
      space: spaceID,
    },
    {
      new: true,
    }
  );

  if (!mentor) {
    return next(new AppError('Could not change role to mentor', 400));
  }

  // add mentor to space
  if (!space.mentors.some(({ _id }) => String(_id) === String(mentorID))) {
    space.mentors.push(mentorID);
    space.save();
  }

  // send response
  res.status(200).json({
    status: 'success',
    data: {
      user: mentor,
      space,
    },
  });
});

exports.makeUser = catchAsynchronousError(async (req, res, next) => {
  const userID = req.params.userID;
  // getting mentor and space
  const user = await User.findById(userID);
  const spaceID = user.space;
  if (!spaceID) {
    res.status(400).json({
      status: 'fail',
      message: 'can not set a User to user if he is not a mentor',
    });
  }
  const space = await Space.findById(spaceID);

  // removing the space from user
  user.space = undefined;
  user.role = 'user';
  user.save();

  // removing the mentor from space
  space.mentors = space.mentors.filter(
    ({ _id }) => String(_id) !== String(userID)
  );
  space.save();

  res.status(200).json({
    status: 'success',
    data: {
      user,
      space,
    },
  });
});

exports.getAllUser = factory.getAll(User);
exports.getOneUser = factory.getOne(User);
exports.deleteOneUser = factory.deleteOne(User);
exports.updateOneUser = factory.updateOne(User);
exports.isIDValid = isIDValid(User);
