const catchAsynchronousError = require('../utils/catchAsynchronousError');
const APIFeatures = require('../utils/APIFeatures');
const bson = require('bson');
const AppError = require('../utils/AppError');

exports.deleteOne = (Model) =>
  catchAsynchronousError(async (req, res) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsynchronousError(async (req, res) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.create = (Model) =>
  catchAsynchronousError(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { data: document },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsynchronousError(async (req, res, next) => {
    const id = req.params.id;
    // check if id is valid ObjectID
    if (!bson.ObjectID.isValid(id)) {
      return next(new AppError(id + ' is not a valid ObjectId', 400));
    }

    let query = Model.findById(id);
    if (populateOptions) query.populate(populateOptions);
    const document = await query;

    // id is not valid
    if (!document) {
      return next(
        new AppError('No document found with the id' + String(id), 404)
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsynchronousError(async (req, res) => {
    console.log(1);
    // TODO refacto ce hack
    // pour permettre les router nesté pour GET les reviews
    let filter = {};
    if (req.params.spaceID) filter = { space: req.params.spaceID };
    if (req.params.userID) filter = { user: req.params.userID };
    console.log(req.query);
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();
    console.log(2);
    const document = await features.query;
    console.log(3);
    res.status(200).json({
      status: 'success',
      results: document.length,
      data: {
        data: document,
      },
    });
  });
