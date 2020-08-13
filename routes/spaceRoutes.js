const express = require('express');
const spaceController = require('./../controllers/spaceController');
const authentificationController = require('./../controllers/authentificationController');
const reviewRouter = require('./reviewRoutes');
const router = express.Router();


router.use('/:spaceID/reviews', reviewRouter)


router.route('/available-spaces').get(spaceController.getAllSpaces);

router
  .route('/')
  .get(authentificationController.protect, spaceController.getAllSpaces)
  .post(spaceController.createOneSpace);
router
  .route('/:id')
  .get(spaceController.isIDValid, spaceController.getOneSpace)
  .delete(
    spaceController.isIDValid,
    authentificationController.protect,
    authentificationController.restrictTo('admin'),
    spaceController.deleteOneSpace
  )
  .patch(spaceController.isIDValid, spaceController.updateOneSpace);

module.exports = router;
