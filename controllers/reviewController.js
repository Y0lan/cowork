const Review = require('./../models/reviewModel');
const catchAsynchronousError = require('../utils/catchAsynchronousError');
const AppError = require('./../utils/AppError');
const isIDValid = require('./../utils/isIDValid');

exports.isIDValid = isIDValid(Review);

exports.getAllReviews = catchAsynchronousError(async (req, res, next) => {
  const reviews = await Review.find({});
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getAllReviewsOfASpecificSpace = catchAsynchronousError(
  async (req, res, next) => {
    const space = req.params.id;
    const reviews = await Review.find({ space });
    res.status(200).json({
      status: 'success',
      length: reviews.length,
      data: {
        reviews,
      },
    });
  }
);

exports.createReview = catchAsynchronousError(async (req, res, next) => {
  req.body.user = req.user.id;
  const review = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});
