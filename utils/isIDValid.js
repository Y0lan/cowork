const bson = require('bson');

const AppError = require('./../utils/AppError');
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
  return (...ids) => {
    return catchAsynchronousError(async (req, res, next) => {
      for (const id of ids) {
        const nextWithErrorMessage = await checkID(
          req.params[`${id}`],
          Model,
          next
        );
        if (nextWithErrorMessage) return nextWithErrorMessage;
      }
      next();
    });
  };
};

module.exports = isIDValid;
