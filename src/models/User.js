const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "can't be blank"],
      unique: true,
      minlength: 5,
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
    bio: {
      type: String,
      minlength: 16
    },
    avatar: {
      type: String,
      default: 'https://habiiev-wordify.s3.eu-north-1.amazonaws.com/user.png'
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

mongoose.model('User', UserSchema);
