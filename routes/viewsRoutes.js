const express = require('express');
const router = express.Router();
const viewsController = require('./../controllers/viewsController');
const authentificationController = require('./../controllers/authentificationController');

router.get(
  '/',
  authentificationController.isLoggedIn,
  viewsController.getOverview
);

router.get(
  '/space/:slug',
  authentificationController.isLoggedIn,
  viewsController.getSpace
);

router.get(
  '/login',
  authentificationController.isLoggedIn,
  viewsController.getLoginForm
);

router.get(
  '/signup',
  authentificationController.isLoggedIn,
  viewsController.getSignupForm
);

router.get(
  '/me',
  authentificationController.protect,
  viewsController.getAccount
);

module.exports = router;
