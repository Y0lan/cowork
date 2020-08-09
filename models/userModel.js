const crypto = require('crypto');
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
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre('save', async function (next) {
  if(!this.isModified('password') || this.isNew) return next();

  // make sure the jwt is generated and saved to DB BEFORE this field is updated
  this.passwordLastChangedAt = Date.now() - 1000;
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

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 600000; // 10 minutes = 10 * 60 sec = 60 * 1000 millisecondes

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
