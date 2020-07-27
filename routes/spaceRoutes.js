const express = require('express');
const spaceController = require('./../controllers/spaceController');
const router = express.Router();
router.param('id', spaceController.checkID)
router
    .route('/')
    .get(spaceController.getAllSpaces)
    .post(spaceController.checkBody, spaceController.createOneSpace);
router
  .route('/:id')
  .get(spaceController.getOneSpace)
  .delete(spaceController.deleteOneSpace)
  .patch(spaceController.modifyOneSpace);
module.exports = router;
