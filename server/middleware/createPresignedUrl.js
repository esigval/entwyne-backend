const AWS = require('aws-sdk');
const moment = require('moment'); // for generating timestamp
const dotenv = require('dotenv');
dotenv.config();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const createPresignedUrl = (bucketName, videoName, expires = 60) => {
  // Generate a unique key using the video name and a timestamp
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const key = `videos/${videoName}_${timestamp}.mp4`;

  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: expires, // Expiration time in seconds
  };

  return s3.getSignedUrlPromise('putObject', params);
};

module.exports = createPresignedUrl;
