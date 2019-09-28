const path = require('path');

const flash = require('express-flash');
const morgan = require('morgan');
const express = require('express');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const expressSession = require('express-session');

const app = express();

const config = require('./config');
const router = require('./routes');

app.use(cookieParser());
app.use(
  expressSession({
    secret: config.sessionSecret,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

app.use(flash());

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
