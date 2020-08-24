const express = require('express');
const reviewController = require('../controllers/reviewController');
const spaceController = require('./../controllers/spaceController');
const authentificationController = require('../controllers/authentificationController');
const router = express.Router({
  mergeParams: true,
});

router.use(authentificationController.protect);

router
  .route('/')
  // spaceID is from routes/spaceRoutes.js
  .get(
    spaceController.isIDValid('spaceID'),
    reviewController.getAllReviewOfOneSpace
  )
  .post(
    // spaceID is from routes/spaceRoutes.js
    spaceController.isIDValid('spaceID'),
    authentificationController.protect,
    authentificationController.restrictTo('user'),
    reviewController.setIDs,
    reviewController.createReview
  );
router
  .route('/:id')
  .patch(
    reviewController.isIDValid('id'),
    reviewController.checkUserPermission,
    reviewController.updateOneReview
  )
  .delete(
    reviewController.isIDValid('id'),
    reviewController.checkUserPermission,
    reviewController.deleteOneReview
  )
  .get(
    reviewController.isIDValid('id'),
    reviewController.checkUserPermission,
    reviewController.getOneReview
  );

module.exports = router;
