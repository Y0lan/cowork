const express = require('express')
const router = express.Router()
const viewsController = require('./../controllers/viewsController')

router.get('/', viewsController.getOverview)

router.get('/space', (req, res) => {
  res.status(200).render('space', {
    title: 'space'
  })
})

module.exports = router
