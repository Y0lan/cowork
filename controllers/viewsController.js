const Space = require('./../models/spaceModel')
const catchAsynchronousError = require('../utils/catchAsynchronousError');
exports.getOverview = catchAsynchronousError( async (req, res, next) => {
  const spaces = await Space.find()
  res.status(200).render('overview', {
    title: 'All Coworking Spaces',
    spaces
  })
})
exports.getSpace = (req, res) => {
  res.status(200).render('space', {
    title: 'Get One Coworking'
  })
}
