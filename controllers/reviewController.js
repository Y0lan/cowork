const Review = require('./../models/reviewModel');
const catchAsynchronousError = require('../utils/catchAsynchronousError');
const isIDValid = require('./../utils/isIDValid');
const factory = require('./handlerFactory');

exports.isIDValid = isIDValid(Review);

exports.getAllReviews = catchAsynchronousError(async (req, res, next) => {
  let filter = {};
  if (req.params.spaceID) filter = { space: req.params.spaceID };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.setIDs = (req, res, next) => {
  if (!req.body.space) req.body.space = req.params.spaceID;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.create(Review);

exports.deleteOneReview = factory.deleteOne(Review);
exports.updateOneReview = factory.updateOne(Review);
