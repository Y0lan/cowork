const catchAsynchronousError = require('../utils/catchAsynchronousError');
exports.deleteOne = (Model) =>
  catchAsynchronousError(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsynchronousError(async (req, res, next) => {
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
  catchAsynchronousError(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { data: document },
    });
  });
