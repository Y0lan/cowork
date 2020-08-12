const express = require('express');
const reviewController = require('../controllers/reviewController');
const spaceController = require('./../controllers/spaceController');
const authentificationController = require('../controllers/authentificationController');
const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authentificationController.protect,
    authentificationController.restrictTo('user'),
    reviewController.createReview
  );
router.route('/:id').get();

router
  .route('/spaces/:id')
  .get(
    spaceController.isIDValid,
    reviewController.getAllReviewsOfASpecificSpace
  );
module.exports = router;
