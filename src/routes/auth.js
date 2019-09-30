const router = require('express').Router();
const mongoose = require('mongoose');
const autoSanitizer = require('express-autosanitizer');
const { check, validationResult } = require('express-validator');

const User = mongoose.model('User');

router
  .route('/signup')
  .get((req, res) => res.render('auth/signup', { title: 'Sign up' }))
  .post(
    autoSanitizer.routeUnsafe,
    [
      check('username')
        .trim()
        .isLength(5, 32)
        .withMessage('Username must be between 5 and 32 characters long')
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
    ],

    (req, res, next) => {
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
          req.flash('info', 'You are registered. You can login now!');
          res.redirect('/auth/login');
        })
        .catch(err => {
          // TODO: Mongoose error handling
          res.send(err);
        });
    }
  );

router.route('/login').get((req, res) => res.render('auth/login', { title: 'Login' }));

module.exports = router;
