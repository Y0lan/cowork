const express = require('express');
const reviewController = require('../controllers/reviewController');
const spaceController = require('./../controllers/spaceController');
const authentificationController = require('../controllers/authentificationController');
const router = express.Router({
  mergeParams: true,
});

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    spaceController.isIDValid,
    authentificationController.protect,
    authentificationController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
