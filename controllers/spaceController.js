const multer = require('multer');
const sharp = require('sharp');
const Space = require('./../models/spaceModel');
const catchAsynchronousError = require('../utils/catchAsynchronousError');
const factory = require('./handlerFactory');
const isIDValid = require('./../utils/isIDValid');
const AppError = require('./../utils/AppError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    return callback(null, true);
  }
  callback(new AppError('You can only upload an image here! 😬', 404), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadSpaceImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 4 },
]);

exports.resizeSpaceImages = async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  req.body.imageCover = `space-${req.params.id}-cover`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({
      quality: 90,
    })
    .toFile(`public/img/spaces/${req.body.imageCover}`);

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `space-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/spaces/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
};

const isValidCoordinates = (coordinates) => {
  const [lat, long] = coordinates.split(',');
  if (lat > 90 && lat < -90 && long < 180 && long > 180) {
    return [false, false];
  }
  return [long * 1, lat * 1];
};

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
  const { distance, coordinates, unit } = req.params;
  const [longitude, latitude] = isValidCoordinates(coordinates);
  if (!latitude || !longitude) {
    return next(
      new AppError(
        'Please provide valid coordinates: ' + 'latitude,longitude',
        400
      )
    );
  }
  // distance / earth circumference in miles or kilometers
  const radius = unit === 'miles' ? distance / 3963.2 : distance / 6378.1;
  const spaces = await Space.find({
    location: {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], radius],
      },
    },
  });

  res.status(200).json({
    status: 'success',
    results: spaces.length,
    data: {
      data: spaces,
    },
  });
});
exports.getDistance = catchAsynchronousError(async (req, res, next) => {
  const { coordinates, unit } = req.params;
  const [longitude, latitude] = isValidCoordinates(coordinates);
  if (!latitude || !longitude) {
    return next(
      new AppError(
        'Please provide valid coordinates: ' + 'latitude,longitude',
        400
      )
    );
  }
  const distance = await Space.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [latitude, longitude],
        },
        key: 'location',
        distanceField: 'distance',
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      data: distance,
    },
  });
});

exports.getAllSpace = factory.getAll(Space);
exports.getOneSpace = factory.getOne(Space, { path: 'reviews' });
exports.updateOneSpace = factory.updateOne(Space);
exports.deleteOneSpace = factory.deleteOne(Space);
exports.isIDValid = isIDValid(Space);

exports.getSpacesStatistics = catchAsynchronousError(async (req, res, next) => {
  //TODO trouver des statistiques si jamais j'ai le temps
  next();
});
