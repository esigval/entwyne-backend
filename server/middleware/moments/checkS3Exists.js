import AWS from 'aws-sdk';
import { config } from '../../config.js';
import dotenv from 'dotenv';
dotenv.config();

const s3 = new AWS.S3();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

export const checkS3Exists = async (key) => {
    console.log('checkS3Exists:', key);
    try {
        const params = {
            Bucket: currentConfig.MEZZANINE_BUCKET,
            Key: key
        };
        const headObject = await s3.headObject(params).promise();
        return headObject.ContentLength > 0;
    } catch (error) {
        if (error.code === 'NotFound') {
            return false;
        }
        throw new Error('An error occurred while checking the file existence');
    }
};

export default checkS3Exists;