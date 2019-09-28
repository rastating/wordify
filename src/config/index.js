const path = require('path');

const assert = require('assert');
const dotenv = require('dotenv');

// Read `.env` file
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const { NODE_ENV, HOST, PORT, MONGO, SESSIONSECRET } = process.env;

// Check for required environment variables
assert(NODE_ENV, 'NODE_ENV environment variable is required');
assert(MONGO, 'MongoDB Connection string in MONGO environment variable is required');
assert(SESSIONSECRET, 'SESSIONSECRET environment variable is required');

module.exports = {
  env: NODE_ENV,
  port: PORT || 5500,
  host: HOST || '127.0.0.1',
  dbUrl: MONGO,
  sessionSecret: SESSIONSECRET
};
