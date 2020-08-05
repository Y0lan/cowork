const express = require('express');
const userController = require('./../controllers/userController');
const authentificationController = require('./../controllers/authentificationController');
const router = express.Router();

router.post(
  '/signup',
  authentificationController.incrementID,
  authentificationController.signup
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
