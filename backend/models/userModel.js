const crypto = require('crypto');
const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcrypt');

const usernameSchema = Joi.string().min(4).required();
const emailSchema = Joi.string().email({ tlds: { allow: false } }).required();
const passwordSchema = Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,}$')).required();

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide username'],
    validate: {
      validator: function (value){
      const { error } = usernameSchema.validate(value);
      if (error) {
        return false;
      }
      return true;
      },
      message: 'Please provide a valid username with at least 4 characters'
    }
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    Lowercase: true,
    validate: {
      validator: function (value){
      const { error } = emailSchema.validate(value);
      if (error) {
        return false;
      }
      return true;
      },
      message: 'Please provide a valid email address'
    }
  },
  photo: {
    type: String,
    default: 'https://i.ibb.co/2HTV3dh/Default-profile-image.jpg'
  },
  deleteURL: {
    type: String,
    default: null
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
    select: false,
    validate: {
      validator: function (value){
        const { error } = passwordSchema.validate(value);
        if (error) {
          return false;
        }
        return true;
      },
      message: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be at least 8 characters long.'
    }
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

userSchema.pre('save', function (){
  this.username = this.username.toLowerCase();
  this.email = this.email.toLowerCase();
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