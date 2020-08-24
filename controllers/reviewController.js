const Review = require('./../models/reviewModel');
const isIDValid = require('./../utils/isIDValid');
const factory = require('./handlerFactory');
const catchAsynchronousError = require('../utils/catchAsynchronousError');
const AppError = require('./../utils/AppError');

exports.setIDs = (req, res, next) => {
  if (!req.body.space) req.body.space = req.params.spaceID;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.checkUserPermission = catchAsynchronousError(async (req, res, next) => {
  if (req.user.role === 'admin') return next();

  const review = await Review.findById(req.params.id);
  if (String(review.user._id) !== String(req.user.id))
    return next(new AppError('This is not your review', 400));
  next();
});

exports.getAllReviewOfOneSpace = factory.getAll(Review);
exports.createReview = factory.create(Review);
exports.deleteOneReview = factory.deleteOne(Review);
exports.updateOneReview = factory.updateOne(Review);
exports.getOneReview = factory.getOne(Review);
exports.isIDValid = isIDValid(Review);
