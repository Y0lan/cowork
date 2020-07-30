const Space = require('./../models/spaceModel');
const APIFeatures = require('../utils/APIFeatures');

exports.checkID = async (req, res, next) => {
  const spaces = await Space.find({}, '_id');
  const ids = spaces.map((obj) => obj._id);
  const id = req.params.id;
  if (!ids.includes(id)) {
    return res.status(400).json({
      status: 'fail',
      error: 'Invalid request',
    });
  }
  next();
};

exports.incrementID = async (req, res, next) => {
  const total = await Space.countDocuments();
  req.body._id = total + 1;
  next();
};

exports.getAllSpaces = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getOneSpace = async (req, res) => {
  try {
    const id = req.params.id * 1;
    const spaceRequested = await Space.findById(id);
    res.status(200).json({
      status: 'success',
      data: {
        space: spaceRequested,
      },
    });
    res.send();
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.createOneSpace = async (req, res) => {
  try {
    const space = await Space.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        space,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.updateOneSpace = async (req, res) => {
  try {
    const space = await Space.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      data: {
        space,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.deleteOneSpace = async (req, res) => {
  try {
    const id = req.params.id * 1;
    const space = await Space.findByIdAndDelete(id);
    res.status(201).json({
      status: 'success',
      data: {
        space,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getSpacesStatistics = async (req, res, next) => {
  next()
};
