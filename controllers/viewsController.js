const Space = require('./../models/spaceModel');
const catchAsynchronousError = require('../utils/catchAsynchronousError');
const AppError = require('../utils/AppError');
exports.getOverview = catchAsynchronousError(async (req, res, next) => {
  const spaces = await Space.find();
  res.status(200).render('overview', {
    title: 'All Coworking Spaces',
    spaces,
  });
});
exports.getSpace = catchAsynchronousError(async (req, res, next) => {
  const space = await Space.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!space) return next(new AppError('No space exist at this address', 404));

  res.status(200).render('space', {
    title: `${space.name}`,
    space,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'login',
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'signup',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  })
}
