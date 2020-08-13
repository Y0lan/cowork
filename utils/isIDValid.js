const bson = require('bson');
const AppError = require('./../utils/AppError');
const catchAsynchronousError = require('../utils/catchAsynchronousError');

const isIDValid = (model) => {
  return catchAsynchronousError(async (req, res, next) => {
      const id = req.params.id;
      if (!bson.ObjectID.isValid(id)) {
        return next(new AppError(id + ' is not a valid ObjectId', 400));
      }
      const validID = await model.findById(id);
      if (!validID) {
        return next(
          new AppError('Nothing found with the id' + String(id), 404)
        );
      }
      next();
    });
};

module.exports = isIDValid;
