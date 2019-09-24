const http = require('http');
const path = require('path');

const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const config = require('./config');

mongoose.connect(config.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
if (config.env === 'development') mongoose.set('debug', true);

require('./models/Article');

const app = require('./app');

const server = http
  .createServer(app)
  .listen(config.port, config.host, () =>
    console.log(`Server on ${server.address().address}:${server.address().port}`)
  );
