const path = require('path');

const assert = require('assert');
const dotenv = require('dotenv');

// Read `.env` file
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const {
  DOMAIN_NAME,
  NODE_ENV,
  PORT,
  MONGO,
  SESSIONSECRET,
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  AWS_S3_REGION,
  AWS_S3_BUCKET,
  SENDGRID_API_KEY,
  SENDGRID_FROM_ADDRESS
} = process.env;

// Check for required environment variables
assert(NODE_ENV, 'NODE_ENV environment variable is required');
assert(DOMAIN_NAME, 'DOMAIN_NAME environment variable is required');

assert(MONGO, 'MongoDB Connection string in MONGO environment variable is required');
assert(SESSIONSECRET, 'SESSIONSECRET environment variable is required');

assert(AWS_S3_ACCESS_KEY_ID, 'AWS_S3_ACCESS_KEY_ID environment variable is required');
assert(AWS_S3_ACCESS_KEY, 'AWS_S3_ACCESS_KEY environment variable is required');
assert(AWS_S3_REGION, 'AWS_S3_REGION environment variable is required');
assert(AWS_S3_BUCKET, 'AWS_S3_BUCKET environment variable is required');

assert(SENDGRID_API_KEY, 'SENDGRID_API_KEY environment variable is required');
assert(SENDGRID_FROM_ADDRESS, 'SENDGRID_FROM_ADDRESS environment variable is required');

module.exports = {
  env: NODE_ENV,
  domain: DOMAIN_NAME,
  port: PORT || 5500,
  dbUrl: MONGO,
  sessionSecret: SESSIONSECRET,
  s3KeyId: AWS_S3_ACCESS_KEY_ID,
  s3AccessKey: AWS_S3_ACCESS_KEY,
  s3Region: AWS_S3_REGION,
  s3Bucket: AWS_S3_BUCKET,
  sendgridApi: SENDGRID_API_KEY,
  sendgridFrom: SENDGRID_FROM_ADDRESS
};
