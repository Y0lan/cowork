const Space = require('./../models/spaceModel');
const moment = require('moment');

const getNumberOfElements = async (Element) => {
  const elements = await Element.find({});
  return elements.length * 1;
};

// Adding $ in front of get, gt, lte, lt in the query for querying in a more human way
const advancedFiltering = (query) => {
  return JSON.stringify(query).replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
};

const sortQuery = (query, fields) => {
  const sortBy = fields.split(',').join(' ');
  return query.sort(sortBy);
};

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
  const total = await getNumberOfElements(Space);
  req.body._id = total + 1;
  next();
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {}

  sort() {}

  limits() {}
}

exports.getAllSpaces = async (req, res) => {
  // constructing the query
  try {
    // 1) Filtering
    const queryObject = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(
      (elementToDelete) => delete queryObject[elementToDelete]
    );
    // 2) Advanced filtering
    let queryString = advancedFiltering(queryObject);
    queryString = JSON.parse(queryString);

    let query = Space.find(queryString);
    // 3) Sorting
    const sort = req.query.sort;
    if (sort) {
      query = sortQuery(query, sort);
    } else {
      query.sort('-createdAt');
    }
    // 4) Fields limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }
    query = query.select('-__v');

    // 5) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = page * limit - limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numSpaces = await Space.countDocuments();
      if (skip >= numSpaces) throw new Error('This page does not exist');
    }

    // executing the query
    const spaces = await query;
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
