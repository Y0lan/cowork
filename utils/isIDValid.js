const bson = require('bson');
const AppError = require('./../utils/AppError');
const catchAsynchronousError = require('../utils/catchAsynchronousError');

const isIDValid = (Model) => {
  return catchAsynchronousError(async (req, res, next) => {
    const id = req.params.id || req.params.spaceID || req.params.reviewID;
    if (!bson.ObjectID.isValid(id)) {
      return next(new AppError(id + ' is not a valid ObjectId', 400));
    }
    const document = await Model.findById(id);
    if (!document) {
      return next(new AppError('No document found with the id' + String(id), 404));
    }
    next();
  });
};

module.exports = isIDValid;
