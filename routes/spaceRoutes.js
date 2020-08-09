const express = require('express');
const spaceController = require('./../controllers/spaceController');
const authentificationController = require('./../controllers/authentificationController');
const router = express.Router();

router.route('/available-spaces').get(spaceController.getAllSpaces);

router
  .route('/')
  .get(authentificationController.protect, spaceController.getAllSpaces)
  .post(spaceController.incrementID, spaceController.createOneSpace);
router
  .route('/:id')
  .get(spaceController.doesIdExist, spaceController.getOneSpace)
  .delete(
    spaceController.doesIdExist,
    authentificationController.protect,
    authentificationController.restrictTo('admin'),
    spaceController.deleteOneSpace
  )
  .patch(spaceController.doesIdExist, spaceController.updateOneSpace);
module.exports = router;
