const express = require('express');
const spaceController = require('./../controllers/spaceController');
const router = express.Router();
router
    .route('/')
    .get(spaceController.getAllSpaces)
    .post(spaceController.createOneSpace);
router
  .route('/:id')
  .get(spaceController.getOneSpace)
  .delete(spaceController.deleteOneSpace)
  .patch(spaceController.modifyOneSpace);
module.exports = router;
