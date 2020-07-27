const mongoose = require('mongoose');
const spaceSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  name: {
    type: 'String',
    unique: true,
    required: [true, 'A space must have a name!'],
  },
  description: {
    type: 'String',
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  open_time_monday_thursday: {
    type: [Date, Date],
    required: [true, 'A space must specify monday to thursday business hours!'],
  },
  open_time_friday: {
    type: [Date, Date],
    required: [true, 'A space must specify friday business hours!'],
  },
  open_time_week_end: {
    type: [Date, Date],
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
});
const Space = mongoose.model('Space', spaceSchema);
module.exports = Space;
