const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const config = require('../config');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "can't be blank"],
      unique: true,
      minlength: 3,
      maxlength: 32,
      index: true,
      match: [/^[a-zA-Z0-9_]+$/, 'is invalid']
    },
    email: {
      type: String,
      required: [true, "can't be blank"],
      unique: true,
      match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    emailConfirmed: {
      type: Boolean,
      default: false
    },
    bio: {
      type: String
    },
    avatar: {
      type: String,
      default: `https://${config.s3Bucket}.s3.${config.s3Region}.amazonaws.com/user.png`
    },
    password: {
      type: String,
      required: [true, "can't be blank"],
      minlength: 8,
      maxlength: 128
    }
  },
  { timestamps: true }
);

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10).then(function(hash) {
    user.password = hash;
    next();
  });
});

UserSchema.plugin(uniqueValidator, { message: 'is already taken' });

module.exports = mongoose.model('User', UserSchema);
