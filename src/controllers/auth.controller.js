const mongoose = require('mongoose');
const passport = require('passport');
const { check, validationResult } = require('express-validator');

const config = require('../config');
const sendEmail = require('../utils/sendEmail');
const mongooseError = require('../utils/mongooseErrorHandler');

const User = mongoose.model('User');
const EmailConfirmationToken = mongoose.model('EmailConfirmationToken');

// User validation middleware
exports.validateUser = [
  check('username')
    .trim()
    .isLength(3, 32)
    .withMessage('Username must be between 3 and 32 characters long')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must contain only letters numbers and underscores')
    .custom(value =>
      User.findOne({ username: value }).then(user => {
        if (user) return Promise.reject('Username is already in use');
      })
    ),

  check('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .custom(value =>
      User.findOne({ email: value }).then(user => {
        if (user) return Promise.reject('User with email is already registered');
      })
    ),

  check('password')
    .isLength(8, 64)
    .withMessage('Password must be between 8 and 64 characters long'),

  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match');
    return true;
  })
];

// Render signup user form
exports.createUserForm = (req, res) => {
  res.render('auth/signup', { title: 'Sign up' });
};

// POST route for creating user
exports.createUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.render('auth/signup', {
      title: 'Sign up',
      errors: errors.errors.reduce((r, value) => {
        if (!r[value.param]) r[value.param] = value.msg;
        return r;
      }, {}),
      username: req.body.username,
      email: req.body.email
    });

  User.create({ username: req.body.username, email: req.body.email, password: req.body.password })
    .then(user => {
      EmailConfirmationToken.create({ user }).then(token => {
        sendEmail(
          user.email,
          'Please verify your email',
          `Please follow this link to verify your email: ${config.domain}/auth/email/${token.id}`,
          `Please follow this <a href="${config.domain}/auth/email/${token.id}">link to verify your email</a><br>If you cannot see the link, click here: ${config.domain}/auth/email/${token.id}`
        );

        req.flash('info', 'You are registered. You have to verify your email before you can login');
        res.redirect('/auth/login');
      });
    })
    .catch(err =>
      mongooseError(err, next, mErrors =>
        res.render('auth/signup', {
          title: 'Sign up',
          errors: mErrors,
          username: req.body.username,
          email: req.body.email
        })
      )
    );
};

// Render login user form
exports.loginUserForm = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

// Login the user using passport
exports.loginUser = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/auth/login',
    failureFlash: true,
    successFlash: 'Successfully logged in!'
  })(req, res, next);
};

// Logout user
exports.logoutUser = (req, res) => {
  req.logout();
  req.flash('info', 'You have been logged out');
  res.redirect('/');
};

// Verify email by token
exports.verifyEmail = (req, res, next) => {
  // Get token by id from params
  EmailConfirmationToken.findById(req.params.token)
    .then(token => {
      if (!token) {
        const err = new Error('Invalid token');
        err.status = 404;
        return next(err);
      }
      // Find user by user id from token
      User.findById(token.user).then(user => {
        user.emailConfirmed = true;
        user.save();
        token.remove();
        req.flash('info', 'Email has been successfully confirmed!');
        res.redirect('/');
      });
    })
    .catch(err => next(new Error(err)));
};

exports.resendEmail = (req, res, next) => {
  EmailConfirmationToken.findOne({ user: req.user })
    .then(token => {
      if (!token) {
        EmailConfirmationToken.create({ user: req.user }).then(t => {
          sendEmail(
            req.user.email,
            'Please verify your email',
            `Please follow this link to verify your email: ${config.domain}/auth/email/${t.id}`,
            `Please follow this <a href="${config.domain}/auth/email/${t.id}">link to verify your email</a><br>If you cannot see the link, click here: ${config.domain}/auth/email/${t.id}`
          );

          req.flash('info', 'Email verification token has been resent. Please check your email');
          return res.redirect('/profile/update');
        });
      }

      sendEmail(
        req.user.email,
        'Please verify your email',
        `Please follow this link to verify your email: ${config.domain}/auth/email/${token.id}`,
        `Please follow this <a href="${config.domain}/auth/email/${token.id}">link to verify your email</a><br>If you cannot see the link, click here: ${config.domain}/auth/email/${token.id}`
      );

      req.flash('info', 'Email verification token has been resent. Please check your email');
      res.redirect('/profile/update');
    })
    .catch(err => next(new Error(err)));
};
