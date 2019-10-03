const http = require('http');

const mongoose = require('mongoose');

const config = require('./config');

// Connect to Mongo and get rid of deprecation warnings
mongoose.connect(config.dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

if (config.env === 'development') mongoose.set('debug', true);

// Load in the models so we can use mongoose.model('Model name') to get the model
require('./models/Article');
require('./models/User');

const app = require('./app');

const server = http.createServer(app).listen(config.port, () => console.log(`Server on port ${server.address().port}`));
