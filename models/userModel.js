const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
  _id: {
    unique: true,
    type: String,
  },
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    //TODO better strenght validator
    minlength: 8,
  },
});

const User = mongoose.model('User', userSchema)

module.exports = User;
