import AWS from 'aws-sdk';
import moment from 'moment';
import dotenv from 'dotenv';
import storylineModel from '../../models/storylineModel.js';

dotenv.config();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const createPresignedUrl = async (bucketName, promptId, expires = 60) => {
  // Get storylineId from the database
  const storylineId = await storylineModel.getStorylineId(promptId);

  // Get the base name from the environment variables
  const baseName = process.env.VIDEOS_BASE_NAME;
  // Generate a unique key using the video name and a timestamp
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const key = `${baseName}/${storylineId}/${promptId}_${timestamp}.webm`;

  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: expires, // Expiration time in seconds
    ContentType: 'video/webm', // Specify the content type
  };

  return { presignedUrl: s3.getSignedUrlPromise('putObject', params), key };
};

export default createPresignedUrl;