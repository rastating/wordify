const http = require('http');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = require('./app');

const server = http
  .createServer(app)
  .listen(5500, '127.0.0.1', () =>
    console.log(
      `Server on ${server.address().address}:${server.address().port}`
    )
  );
