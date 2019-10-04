const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const config = require('../config');

AWS.config.update({ secretAccessKey: config.s3AccessKey, accessKeyId: config.s3KeyId, region: config.s3Region });

const s3 = new AWS.S3();

const upload = multer({
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) cb(null, true);
    else cb(new Error('Invalid file extension. Please provide a valid image file.'));
  },
  storage: multerS3({
    s3,
    bucket: config.s3Bucket,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `${Date.now().toString()}-${Math.floor(Math.random() * 36 ** 3 || 0).toString()}.png`);
    }
  })
});

module.exports = upload;
