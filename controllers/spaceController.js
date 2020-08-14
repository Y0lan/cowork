const Space = require('./../models/spaceModel');
const catchAsynchronousError = require('../utils/catchAsynchronousError');
const factory = require('./handlerFactory');
const isIDValid = require('./../utils/isIDValid');

exports.createOneSpace = catchAsynchronousError(async (req, res, next) => {
  const space = await Space.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      space,
    },
  });
});

exports.isIDValid = isIDValid(Space);
exports.getAllSpace = factory.getAll(Space);
exports.getOneSpace = factory.getOne(Space, { path: 'reviews' });
exports.updateOneSpace = factory.updateOne(Space);
exports.deleteOneSpace = factory.deleteOne(Space);

exports.getSpacesStatistics = catchAsynchronousError(async (req, res, next) => {
  //TODO tout le bordel des stats loool
  next();
});
