const express = require('express');
const userController = require('./../controllers/userController');
const authentificationController = require('./../controllers/authentificationController');
const router = express.Router();

router.post(
  '/signup',
  authentificationController.incrementID,
  authentificationController.signup
);

router.post('/login', authentificationController.login);
router.post('/forgotPassword', authentificationController.forgotPassword);
router.patch('/resetPassword/:token', authentificationController.resetPassword);
router.patch(
  '/updateMyPassword',
  authentificationController.protect,
  authentificationController.updateMyPassword
);

router.patch(
  '/updateMe',
  authentificationController.protect,
  userController.updateMe
);

router.delete(
  '/deleteMe',
  authentificationController.protect,
  userController.deleteMe
);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getOneUser)
  .delete(userController.deleteOneUser)
  .patch(userController.modifyOneUser);
module.exports = router;
