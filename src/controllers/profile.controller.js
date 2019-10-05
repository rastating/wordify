const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const upload = require('../utils/awsUpload');
const mongooseError = require('../utils/mongooseErrorHandler');

const User = mongoose.model('User');

exports.validateProfile = [
  check('username')
    .trim()
    .isLength(5, 32)
    .withMessage('Username must be between 5 and 32 characters long')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must contain only letters numbers and underscores')
    .custom((value, { req }) =>
      User.findOne({ username: value }).then(user => {
        if (user && user.id !== req.user.id) return Promise.reject('Username is already in use');
      })
    ),

  check('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .custom((value, { req }) =>
      User.findOne({ email: value }).then(user => {
        if (user && user.id !== req.user.id) return Promise.reject('User with email is already registered');
      })
    ),

  check('bio').trim()
];

exports.profileUpdateForm = (req, res) => {
  res.render('profile/update', { tile: 'Update Profile' });
};

exports.profileUpdate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.render('profile/update', {
      title: 'Update Profile',
      errors: errors.errors.reduce((r, value) => {
        r[value.param] = value.msg;
        return r;
      }, {})
    });

  req.user.username = req.body.username;
  req.user.email = req.body.email;
  req.user.bio = req.body.bio;

  req.user
    .save()
    .then(() => {
      req.flash('info', 'Profile successfully updated!');
      res.redirect('/profile/update');
    })
    .catch(err =>
      mongooseError(err, next, mErrors => res.render('profile/update', { title: 'Update profile', errors: mErrors }))
    );
};

exports.avatarUpdate = (req, res) => {
  upload.single('avatar')(req, res, err => {
    if (err) {
      req.flash('error', err);
      res.redirect('/profile/update');
    }

    if (req.file) req.user.avatar = req.file.location;
    req.user
      .save()
      .then(() => {
        req.flash('info', 'Profile successfully updated!');
        res.redirect('/profile/update');
      })
      .catch(mErr => {
        req.flash('error', mErr);
        res.redirect('/profile/update');
      });
  });
};
