var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordTokenExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

var UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
