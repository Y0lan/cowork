const mongoose = require('mongoose');
const spaceSchema = new mongoose.Schema({
  _id: {
    unique: true,
    type: String,
  },
  name: {
    type: 'String',
    unique: true,
    trim: true,
    required: [true, 'A space must have a name!'],
  },
  description: {
    type: 'String',
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'A space must have an address'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A space should have a max group size'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  priceDiscount: Number,
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
    required: [true, 'A space must specify monday to thursday business hours!'],
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
  full : {
    type: Boolean,
    default: false
  },
  available_seat : {
   type: Number,
  }
});
const Space = mongoose.model('Space', spaceSchema);
module.exports = Space;
