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
  .get(spaceController.checkID, spaceController.getOneSpace)
  .delete(spaceController.checkID, spaceController.deleteOneSpace)
  .patch(spaceController.checkID, spaceController.updateOneSpace);
module.exports = router;
