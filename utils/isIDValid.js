const bson = require('bson');
const AppError = require('./../utils/AppError');
const Space = require('./../models/spaceModel');
const User = require('./../models/userModel');
const catchAsynchronousError = require('../utils/catchAsynchronousError');
const checkID = catchAsynchronousError(async (id, Model, next) => {
  if (!bson.ObjectID.isValid(id)) {
    return next(new AppError(id + ' is not a valid ObjectId', 400));
  }
  const document = await Model.findById(id);
  if (!document) {
    return next(
      new AppError('No document found with the id: ' + String(id), 404)
    );
  }
  return false;
});
const isIDValid = (Model) => {
  return catchAsynchronousError(async (req, res, next) => {
    let failed = undefined;
    if (req.params.id) failed = await checkID(req.params.id, Model, next);
    if (failed) return failed;
    if (req.params.spaceID) failed = await checkID(req.params.spaceID, Space, next);
    if (failed) return failed;
    if (req.params.userID) failed = await checkID(req.params.userID, User, next);
    if (failed) return failed;

    next();
  });
};

module.exports = isIDValid;
