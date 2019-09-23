const path = require('path');

const express = require('express');
const morgan = require('morgan');

const app = express();

const config = require('./config');
const router = require('./routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

if (config.env === 'development') {
  app.use(morgan('dev'));
}

app.use(router);

module.exports = app;
