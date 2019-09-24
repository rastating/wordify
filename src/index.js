const http = require('http');
const path = require('path');

const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const config = require('./config');

mongoose
  .connect(config.dbUrl)
  .then(() => console.log('Connected to Mongo'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

const app = require('./app');

const server = http
  .createServer(app)
  .listen(config.port, config.host, () =>
    console.log(`Server on ${server.address().address}:${server.address().port}`)
  );
