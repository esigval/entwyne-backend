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

const createPresignedPicturesUrl = async (bucketName, fileName, fileType, expires = 60) => {
  // Get the base name from the environment variables
  const baseName = process.env.IMAGES_BASE_NAME;
  // Generate a unique key using the file name and a timestamp
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const key = `${baseName}/${timestamp}_${fileName}`; // Unique key with timestamp and original filename
  console.log('mime type', fileType);

  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: expires, // Expiration time in seconds
    ContentType: fileType, // Specify the content type
  };

  // Generate a pre-signed URL for the PUT operation
  const presignedUrl = await s3.getSignedUrlPromise('putObject', params);

  console.log('Presigned URL:', presignedUrl);

  return { presignedUrl, key };
};

export default createPresignedPicturesUrl;
