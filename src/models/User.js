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
    }
  },
  { timestamps: true }
);

UserSchema.methods.setPassword = function(password) {
  // TODO: Hash password
};

UserSchema.plugin(uniqueValidator, { message: 'is already taken' });

mongoose.model('User', UserSchema);
