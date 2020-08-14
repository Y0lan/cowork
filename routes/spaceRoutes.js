const express = require('express');
const spaceController = require('./../controllers/spaceController');
const authentificationController = require('./../controllers/authentificationController');
const reviewRouter = require('./reviewRoutes');
const router = express.Router();

router.use('/:spaceID/reviews', reviewRouter);

//TODO add middleware here
router.route('/available-spaces').get(spaceController.getAllSpace);

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
  .get(spaceController.isIDValid, spaceController.getOneSpace)
  .delete(
    spaceController.isIDValid,
    authentificationController.protect,
    authentificationController.restrictTo('admin'),
    spaceController.deleteOneSpace
  )
  .patch(
    authentificationController.protect,
    authentificationController.restrictTo('admin'),
    spaceController.isIDValid,
    spaceController.updateOneSpace
  );

module.exports = router;
