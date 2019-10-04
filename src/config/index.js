const path = require('path');

const assert = require('assert');
const dotenv = require('dotenv');

// Read `.env` file
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const { NODE_ENV, PORT, MONGO, SESSIONSECRET, AWS_S3_ACCESS_KEY_ID, AWS_S3_ACCESS_KEY } = process.env;

// Check for required environment variables
assert(NODE_ENV, 'NODE_ENV environment variable is required');
assert(MONGO, 'MongoDB Connection string in MONGO environment variable is required');
assert(SESSIONSECRET, 'SESSIONSECRET environment variable is required');
assert(AWS_S3_ACCESS_KEY_ID, 'AWS_S3_ACCESS_KEY_ID environment variable is required');
assert(AWS_S3_ACCESS_KEY, 'AWS_S3_ACCESS_KEY environment variable is required');

module.exports = {
  env: NODE_ENV,
  port: PORT || 5500,
  dbUrl: MONGO,
  sessionSecret: SESSIONSECRET,
  s3KeyId: AWS_S3_ACCESS_KEY_ID,
  s3AccessKey: AWS_S3_ACCESS_KEY
};
