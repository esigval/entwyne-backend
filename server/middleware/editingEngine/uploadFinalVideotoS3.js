import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const s3 = new AWS.S3();

const uploadFinalVideoToS3 = async (storylineId, filename) => {
    const filePath = path.join(__dirname, 'renderedVideos', filename); // Replace with your actual file path
    const fileStream = fs.createReadStream(filePath);

    const params = {
        Bucket: 'twyne-renders', // Replace with your bucket name
        Key: `${storylineId}/${filename}`,
        Body: fileStream,
    };

    try {
        const data = await s3.upload(params).promise();
        console.log(`File uploaded successfully at ${data.Location}`);
        return params.Key; // Return the key of the uploaded file
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

export default uploadFinalVideoToS3;