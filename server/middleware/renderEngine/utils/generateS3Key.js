import fs from 'fs';
import AWS from 'aws-sdk';
import { config } from "../../../config.js"; // Adjust the path as necessary

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

// Configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Create an S3 instance
const s3 = new AWS.S3();

// Function to generate S3 key
function generateS3Key(isThumbnail, userId, twyneId, twyneQuality, storylineId) {
    const fileType = isThumbnail ? "thumbnail" : `twyne_${twyneQuality}`;
    const fileExtension = isThumbnail ? "jpg" : "mp4";
    return `${userId}/${twyneId}/${fileType}_${storylineId}.${fileExtension}`;
  }

// Function to upload file to S3
async function uploadToS3(filePath, isThumbnail, userId, twyneId, twyneQuality, storylineId) {
  const fileContent = fs.readFileSync(filePath);
  const params = {
    Bucket: currentConfig.TWYNE_BUCKET,
    Key: generateS3Key(isThumbnail, userId, twyneId, twyneQuality, storylineId),
    Body: fileContent,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, function (err, data) {
      if (err) {
        console.error("Error uploading file:", err);
        reject(err);
      } else {
        console.log(`File uploaded successfully. ${data.Location}`);
        resolve(`s3://${params.Bucket}/${params.Key}`);
      }

      // Delete the local file
      fs.unlink(filePath, function (err) {
        if (err) {
          console.error(`Error deleting file ${filePath}: ${err}`);
        } else {
          console.log(`File deleted successfully: ${filePath}`);
        }
      });
    });
  });
}

export { generateS3Key, uploadToS3 };