const express = require('express');
const userController = require('./../controllers/userController');
const authentificationController = require('./../controllers/authentificationController');
const reviewRouter = require('./reviewRoutes');
const router = express.Router();

router.use('/:userID/reviews', reviewRouter);
router.post('/signup', authentificationController.signup);

router.post('/login', authentificationController.login);
router.post('/forgotPassword', authentificationController.forgotPassword);
router.patch('/resetPassword/:token', authentificationController.resetPassword);

// All the route below will need you to be LOGGED IN.
router.use(authentificationController.protect);

router.patch('/updateMyPassword', authentificationController.updateMyPassword);
router.get('/me', userController.getMe, userController.getOneUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// All the route below will need you to be ADMIN.
router.use(authentificationController.restrictTo('admin'))

router.route('/').get(userController.getAllUser);

router
  .route('/:id')
  .get(userController.isIDValid('id'), userController.getOneUser)
  .delete(userController.isIDValid('id'), userController.deleteOneUser)
  .patch(userController.isIDValid('id'), userController.updateOneUser);

module.exports = router;
