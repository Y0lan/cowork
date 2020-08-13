const Space = require('./../models/spaceModel');
const APIFeatures = require('../utils/APIFeatures');
const catchAsynchronousError = require('../utils/catchAsynchronousError');
const factory = require('./handlerFactory');
const isIDValid = require('./../utils/isIDValid');

exports.isIDValid = isIDValid(Space);
exports.getAllSpaces = catchAsynchronousError(async (req, res, next) => {
  const features = new APIFeatures(Space.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();
  const spaces = await features.query;
  res.status(200).json({
    status: 'success',
    results: spaces.length,
    data: {
      spaces,
    },
  });
});

exports.getOneSpace = catchAsynchronousError(async (req, res, next) => {
  const id = req.params.id;
  const space = await Space.findById(id).populate('reviews');
  res.status(200).json({
    status: 'success',
    data: {
      space,
    },
  });
});

exports.createOneSpace = catchAsynchronousError(async (req, res, next) => {
  const space = await Space.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      space,
    },
  });
});

exports.updateOneSpace = factory.updateOne(Space);

exports.deleteOneSpace = factory.deleteOne(Space);

exports.getSpacesStatistics = catchAsynchronousError(async (req, res, next) => {
  //TODO tout le bordel des stats loool
  next();
});
