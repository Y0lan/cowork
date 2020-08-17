const Space = require('./../models/spaceModel');
const catchAsynchronousError = require('../utils/catchAsynchronousError');
const factory = require('./handlerFactory');
const isIDValid = require('./../utils/isIDValid');
const AppError = require('./../utils/AppError')

const isValidCoordinates = coordinates => {
  const [lat, long] = coordinates.split(',');
  if(lat > 90 &&
    lat < -90 &&
    long < 180 &&
    long > 180) {
    return [false, false];
  }
  return [long * 1, lat * 1]
}

exports.createOneSpace = catchAsynchronousError(async (req, res, next) => {
  const space = await Space.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      space,
    },
  });
});

exports.getSpaceWithin = catchAsynchronousError(async (req, res, next) => {
  const {distance, coordinates, unit } = req.params;
  const [longitude, latitude] = isValidCoordinates(coordinates)
  if(!latitude || !longitude) {
    return next(new AppError('Please provide valid coordinates: ' +
      'latitude,longitude', 400))
  }
  // distance / earth circumference in miles or kilometers
  const radius = unit === 'miles' ? distance / 3963.2 : distance / 6378.1;
  const spaces = await Space.find( {
    location:{
      $geoWithin: {
        $centerSphere : [ [
          longitude, latitude
        ], radius]
      }
    }
    }
  );

  res.status(200).json({
    status: 'success',
    results: spaces.length,
    data: {
      data: spaces
    }
  })
});
exports.getDistance = catchAsynchronousError( async (req, res, next) => {
  const {coordinates, unit} = req.params;
  const [ longitude, latitude ] = isValidCoordinates(coordinates)
  if(!latitude || !longitude) {
    return next(new AppError('Please provide valid coordinates: ' +
      'latitude,longitude', 400))
  }
  const distance = await Space.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [latitude, longitude]
        },
        key: 'location',
        distanceField: 'distance'
      }
    }
  ])
  console.log(longitude, latitude, distance);
  res.status(200).json({
    status: 'success',
    data: {
      data: distance
    }
  })
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
