const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.status(418).end('Server working!'));

module.exports = app;
