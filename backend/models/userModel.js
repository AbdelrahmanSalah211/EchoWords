const crypto = require('crypto');
const mongoose = require('mongoose');
const joi = require('joi');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    Lowercase: true,
  },
  photo: {
    type: String,
    default: "https://i.ibb.co/2HTV3dh/Default-profile-image.jpg"
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
    select: false,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre('save', async function () {
  if (this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 12);
  }
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  console.log({resetToken}, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
}

userSchema.pre(/^find/,function(next){
  this.find({active: { $ne: false } });
  next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;