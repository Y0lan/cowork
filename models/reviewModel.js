const mongoose = require('mongoose');

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

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
