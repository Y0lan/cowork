const express = require('express');

const spaceController = require('./../controllers/spaceController');
const authentificationController = require('./../controllers/authentificationController');
const { uploadSpaceImages, resizeSpaceImages } = spaceController;
const reviewRouter = require('./reviewRoutes');
const router = express.Router();

router.use('/:spaceID/reviews', reviewRouter);

//TODO add middleware here
router.route('/available-spaces').get(spaceController.getAllSpace);
router
  .route('/space-within/:distance/center/:coordinates/unit/:unit')
  .get(spaceController.getSpaceWithin);
router
  .route('/distance/:coordinates/unit/:unit')
  .get(spaceController.getDistance);

router
  .route('/')
  .get(spaceController.getAllSpace)
  .post(
    authentificationController.protect,
    authentificationController.restrictTo('admin'),
    spaceController.createOneSpace
  );
router
  .route('/:id')
  .get(spaceController.isIDValid('id'), spaceController.getOneSpace)
  .delete(
    spaceController.isIDValid('id'),
    authentificationController.protect,
    authentificationController.restrictTo('admin'),
    spaceController.deleteOneSpace
  )
  .patch(
    authentificationController.protect,
    authentificationController.restrictTo('admin'),
    spaceController.isIDValid('id'),
    uploadSpaceImages,
    resizeSpaceImages,
    spaceController.updateOneSpace
  );

module.exports = router;
