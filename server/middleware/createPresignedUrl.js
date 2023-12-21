import AWS from 'aws-sdk';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const createPresignedUrl = (bucketName, promptId, expires = 60) => {
  // Generate a unique key using the video name and a timestamp
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const key = `video/${promptId}_${timestamp}.mp4`;

  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: expires, // Expiration time in seconds
    ContentType: 'video/mp4', // Specify the content type
  };

  return { presignedUrl: s3.getSignedUrlPromise('putObject', params), key };
};

export default createPresignedUrl;