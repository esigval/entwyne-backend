import AWS from 'aws-sdk';
import { config } from '../../config.js';
import dotenv from 'dotenv';
dotenv.config();

const s3 = new AWS.S3();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const checkMomentExistsS3 = async (s3Uris) => {
    console.log('checkMomentExistsS3:', s3Uris);    
    const checkSingleFile = async (s3Uri) => {
        try {
            const { key } = parseS3Uri(s3Uri);

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

    const parseS3Uri = (s3Uri) => {
        const match = s3Uri.match(/^s3:\/\/([^\/]+)\/(.+)$/);
        if (!match) {
            throw new Error(`Invalid S3 URI: ${s3Uri}`);
        }
        let key = match[2];
        const lastDotIndex = key.lastIndexOf('.');
        if (lastDotIndex !== -1) {
            key = key.substring(0, lastDotIndex);
        }
        return {
            bucket: match[1],
            key
        };
    };

    const results = await Promise.all(s3Uris.map(checkSingleFile));
    console.log('results:', results);
    return results.every(result => result === true);
};

export default checkMomentExistsS3;