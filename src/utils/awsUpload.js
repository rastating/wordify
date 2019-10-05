const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = require('../config/aws');
const config = require('../config');

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
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    }
  })
});

module.exports = upload;
