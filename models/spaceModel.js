const mongoose = require('mongoose');
const slugify = require('slugify');
const spaceSchema = new mongoose.Schema(
  {
    name: {
      type: 'String',
      unique: true,
      trim: true,
      required: [true, 'A space must have a name!'],
      minlength: [10, 'A space must have 10 characters minimum'],
    },
    description: {
      type: 'String',
      trim: true,
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      city: String,
      address: String,
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A space should have a max group size'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      // Math.round return int and we want float
      set: (rating) => Math.round(rating * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: function (val) {
        return val < this.price;
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A space must have a summary'],
    },
    imageCover: {
      type: String,
      required: [true, 'A space must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    open_time_monday_thursday: {
      type: [String, String],
      required: [
        true,
        'A space must specify monday to thursday business hours!',
      ],
    },
    open_time_friday: {
      type: [String, String],
      required: [true, 'A space must specify friday business hours!'],
    },
    open_time_week_end: {
      type: [String, String],
      required: [true, 'A space must specify week-end business hours!'],
    },
    food_available: {
      type: Boolean,
      default: false,
    },
    drink_available: {
      type: Boolean,
      default: false,
    },
    wifi_available: {
      type: Boolean,
      default: false,
    },
    number_of_room_conference: {
      type: Number,
      default: 0,
    },
    number_of_call_room: {
      type: Number,
      default: 0,
    },
    number_of_cosy_room: {
      type: Number,
      default: 0,
    },
    number_of_printers: {
      type: Number,
      default: 0,
    },
    number_of_laptop: {
      type: Number,
      default: 0,
    },
    full: {
      type: Boolean,
      default: false,
    },
    mentors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    available_seat: {
      type: Number,
    },
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

spaceSchema.index({
  full: 1,
});
spaceSchema.index({
  number_of_laptop: -1,
});

spaceSchema.index({
  number_of_printers: -1,
});

spaceSchema.index({
  number_of_call_room: -1,
});

spaceSchema.index({
  number_of_room_conference: -1,
});

spaceSchema.index({
  number_of_cosy_room: -1,
});

spaceSchema.index({
  ratingsAverage: 1,
});

spaceSchema.index({
  slug: 1,
});

spaceSchema.index({
  location: '2dsphere',
});

spaceSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

spaceSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'mentors',
    select: '-_v -passwordChangedAt',
  });
  next();
});

spaceSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'space',
  localField: '_id',
});

const Space = mongoose.model('Space', spaceSchema);
module.exports = Space;
