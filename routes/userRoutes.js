const express = require('express');
const userController = require('./../controllers/userController');
const authentificationController = require('./../controllers/authentificationController');
const reviewRouter = require('./reviewRoutes');
const spaceController = require('../controllers/spaceController');
const router = express.Router();

router.use('/:userID/reviews', reviewRouter);
router.post('/signup', authentificationController.signup);

router.post('/login', authentificationController.login);
router.get('/logout', authentificationController.logout);
router.post('/forgotPassword', authentificationController.forgotPassword);
router.patch('/resetPassword/:token', authentificationController.resetPassword);

// All the route below will need you to be LOGGED IN.
router.use(authentificationController.protect);

router.patch('/updateMyPassword', authentificationController.updateMyPassword);
router.get('/me', userController.getMe, userController.getOneUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// All the route below will need you to be ADMIN.
router.use(authentificationController.restrictTo('admin'));

router.route('/').get(userController.getAllUser);
router.route('/mentors').get(userController.getAllMentors);

router
  .route('/:id')
  .get(userController.isIDValid('id'), userController.getOneUser)
  .delete(userController.isIDValid('id'), userController.deleteOneUser)
  .patch(userController.isIDValid('id'), userController.updateOneUser);

router
  .route('/:userID/mentor')
  .delete(userController.isIDValid('userID'), userController.makeUser);

router
  .route('/:mentorID/mentor/:spaceID')
  .put(
    spaceController.isIDValid('spaceID'),
    userController.isIDValid('mentorID'),
    userController.makeMentor
  );
module.exports = router;
