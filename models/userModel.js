const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
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
  //TODO faire "confirmer votre password" en front
  password: {
    type: String,
    required: true,
    //TODO better strength validator
    minlength: 8,
    select: false,
  },
  passwordLastChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (jwtTimeStamp) {
  if (this.passwordLastChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordLastChangedAt.getTime() / 1000,
      10
    );
    console.log(jwtTimeStamp, changedTimestamp);
    return jwtTimeStamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
