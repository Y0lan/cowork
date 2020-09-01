const express = require('express');

const router = express.Router();
const bookingController = require('../controllers/subscriptionController');
const authenticationController = require('./../controllers/authentificationController');

// booking_type:
// - month : 24€
// - year : 240€
// - resident_month: 300€
// - resident_committed : 252€
router.get(
  '/checkout-session/:subscription_type',
  authenticationController.protect,
  authenticationController.restrictTo('user'),
  bookingController.checkSubscriptionType,
  bookingController.getCheckoutSession
);

module.exports = router;
