const http = require('http');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = require('./app');
const config = require('./config');

const server = http
  .createServer(app)
  .listen(config.port, config.host, () =>
    console.log(
      `Server on ${server.address().address}:${server.address().port}`
    )
  );
