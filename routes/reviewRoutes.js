const express = require('express');
const reviewController = require('../controllers/reviewController');
const spaceController = require('./../controllers/spaceController');
const authentificationController = require('../controllers/authentificationController');
const router = express.Router({
  mergeParams: true,
});

router
  .route('/')
  .get(spaceController.isIDValid, reviewController.getAllReview)
  .post(
    spaceController.isIDValid,
    authentificationController.protect,
    authentificationController.restrictTo('user'),
    reviewController.setIDs,
    reviewController.createReview
  );
router.use(authentificationController.protect);
router
  .route('/:id')
  .patch(
    reviewController.isIDValid,
    reviewController.checkUserPermission,
    reviewController.updateOneReview
  )
  .delete(
    reviewController.isIDValid,
    reviewController.checkUserPermission,
    reviewController.deleteOneReview
  )
  .get(
    reviewController.isIDValid,
    reviewController.checkUserPermission,
    reviewController.getOneReview
  );

module.exports = router;
