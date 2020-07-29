const express = require('express');
const spaceController = require('./../controllers/spaceController');
const router = express.Router();
router
  .route('/')
  .get(spaceController.getAllSpaces)
  .post(spaceController.incrementID, spaceController.createOneSpace);
router
  .route('/:id')
  .get(spaceController.checkID, spaceController.getOneSpace)
  .delete(spaceController.checkID, spaceController.deleteOneSpace)
  .patch(spaceController.checkID, spaceController.updateOneSpace);
module.exports = router;
