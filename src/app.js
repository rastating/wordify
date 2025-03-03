const path = require('path');

const flash = require('express-flash');
const morgan = require('morgan');
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);

const app = express();

const config = require('./config');
const router = require('./routes');
const passportConfig = require('./config/passport');

app.use(cookieParser());
app.use(
  expressSession({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

app.use(flash());

passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

const Article = mongoose.model('Article');

// Set global variables on response object
app.use(async (req, res, next) => {
  res.locals.authenticated = req.isAuthenticated();
  res.locals.user = req.user;

  // Load 3 latest articles for footer for every request
  // TODO: Add caching functionality
  try {
    res.locals.footerArticles = await Article.find({})
      .sort('-createdAt')
      .limit(3);
  } catch (err) {
    return next(new Error(err));
  }

  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.use(methodOverride('_method'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

if (config.env === 'development') {
  app.use(morgan('dev'));
}

app.use(router);

module.exports = app;
