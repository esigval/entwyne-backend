import renderingOrder from "./renderingOrder.js";
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import AWS from 'aws-sdk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const s3 = new AWS.S3();

const prepareConcateFileText = async (storylineId) => {

    const order = await renderingOrder(storylineId);

    let bodyFileList = "";

    order.forEach((item) => {
        let filePath;
        const extension = path.extname(item.filePath);
    
        if (item.mediaType.startsWith('image')) {
            filePath = `quedVideos/${item._id.toString()}.mp4`;
        } else if (item.mediaType.startsWith('video')) {
            filePath = `quedVideos/${item._id.toString()}.mp4`;
        }
        
        bodyFileList += `file '${filePath}'\n`;
    });

    const madeWithEntwynePath = 'quedVideos/MadeWithEntwyne.mp4';
    bodyFileList += `file '${madeWithEntwynePath}'\n`;

    const bodyFilePath = `${__dirname}/${storylineId}.txt`;
    fs.writeFileSync(bodyFilePath, bodyFileList);

    // Define the parameters for the S3 upload operation
    const params = {
        Bucket: process.env.S3_POST_BUCKET_NAME,
        Key: `storylines/${storylineId}/BodyClips.txt`,
        Body: fs.createReadStream(bodyFilePath),
        ContentType: 'text/plain'
    };

    // Upload the file to S3
    try {
        await s3.upload(params).promise();
        console.log('Upload successful');
    } catch (err) {
        console.error('Error uploading file:', err);
    }
};

// test prepareConcateFileText('65a59778e91d4c46ebf40ed5');

export default prepareConcateFileText;