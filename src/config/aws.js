const AWS = require('aws-sdk');

const config = require('../config');

AWS.config.update({ secretAccessKey: config.s3AccessKey, accessKeyId: config.s3KeyId, region: config.s3Region });

const s3 = new AWS.S3();

module.exports = s3;
