const mongoose = require('mongoose');
const Space = require('./spaceModel')

const reviewSchema = mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    review: {
      type: String,
      required: [true, 'A review should contain a message'],
    },
    rating: {
      type: Number,
      required: [true, 'A review should have a rating'],
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    space: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Space',
      required: [true, 'A review should reference a space'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// No duplicate review, each user can only post one review per space
reviewSchema.index({
  space: 1,
  user: 1
}, {
  unique: true
} )


reviewSchema.statics.calculateRatingAverage = async function(spaceID) {
  const stats = await this.aggregate([
    { $match: { space: spaceID } },
    {$group : {
      _id : '$space',
      ratingsQuantity: { $sum: 1},
      ratingsAverage: { $avg: '$rating'}
      }}
  ])
  if(stats.length > 0){
    await Space.findByIdAndUpdate(spaceID,
      {
        ratingsAverage: stats[0].ratingsAverage,
        ratingsQuantity: stats[0].ratingsQuantity
      })
  }
  if(stats.length === 0) {
    await Space.findByIdAndUpdate(spaceID,
      {
        ratingsQuantity: 0,
        ratingsAverage: 4.5
      })
  }
}

reviewSchema.post('save', function() {
  this.constructor.calculateRatingAverage(this.space)
})

// findByIdAndUpdate and findByIdAndRemove call the
// findOneAndUpdate and findOneAndDelete
// so we can use this to save into "this" document the review object
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.temporaryReview = await this.findOne()
  next()
})
// then call it after it is deleted
reviewSchema.post(/^findOneAnd/, async function() {
  await this.temporaryReview.constructor.calculateRatingAverage(this.temporaryReview.space)
})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;





