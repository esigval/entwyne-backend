const aws = require('aws-sdk');
const fs = require('fs').promises;

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new aws.S3();

async function uploadVideoFileToS3(filePath, bucketName, s3Key) {
    const fileContent = await fs.readFile(filePath);

    const params = {
        Bucket: bucketName,
        Key: s3Key,
        Body: fileContent,
        ContentType: 'video/mp4'
    };

    const uploadResult = await s3.upload(params).promise();
    return uploadResult.Location; // Returns the URL of the uploaded file
};

module.exports = uploadVideoFileToS3;
