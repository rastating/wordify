const express = require('express');
const morgan = require('morgan');

const app = express();

const config = require('./config');
const router = require('./routes');

app.use(express.urlencoded({ extended: true }));

if (config.env === 'development') {
  app.use(morgan('dev'));
}

app.use(router);

module.exports = app;
