const path = require('path');

const flash = require('express-flash');
const morgan = require('morgan');
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const expressSession = require('express-session');

const app = express();

const config = require('./config');
const router = require('./routes');
const passportConfig = require('./config/passport');

app.use(cookieParser());
app.use(
  expressSession({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
  })
);

app.use(flash());

passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

// Set global variable on response object to true if user is logged in
app.use((req, res, next) => {
  res.locals.authenticated = req.isAuthenticated();
  res.locals.user = req.user;
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
