const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      unique: true,
      minlength: 5,
      maxlength: 32,
      index: true,
      match: [/^[a-zA-Z0-9]+$/, 'is invalid']
    },
    displayName: {
      type: String,
      minlength: 5,
      maxlength: 64
    },
    email: {
      type: String,
      required: [true, "can't be blank"],
      unique: true,
      index: true,
      match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    bio: {
      type: String,
      minlength: 16
    },
    password: {
      type: String,
      required: [true, "can't be blank"],
      minlength: 8,
      maxlength: 128,
      select: false
    }
  },
  { timestamps: true }
);

UserSchema.methods.validatePassword = function(password) {
  const result = bcrypt.compare(password, this.password).then(res => res);
  return result;
};

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(this.password, salt))
    .then(hash => {
      this.password = hash;
    });
});

UserSchema.plugin(uniqueValidator, { message: 'is already taken' });

mongoose.model('User', UserSchema);
