const http = require('http');
const path = require('path');

const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const config = require('./config');

const app = require('./app');

const server = http.createServer(app);

mongoose
  .connect(config.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    server.listen(config.port, config.host, () =>
      console.log(`Server on ${server.address().address}:${server.address().port}`)
    )
  )
  .catch(err => {
    console.error(err);
  });
