import AWS from 'aws-sdk';
import Prompts from '../../../models/promptModel.js';
import Moment from '../../../models/momentModel.js';
import Storyline from '../../../models/storylineModel.js';
import { config } from '../../../config.js';

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

// Initialize the S3 client
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

async function checkS3FileExists(s3Path) {
    // Remove "s3://" prefix and split the path
    // Remove "s3://" prefix and split the path
    const pathWithoutScheme = s3Path.replace('s3://', '');
    const [bucket, ...keyParts] = pathWithoutScheme.split('/');
    // Join the key parts and remove the file extension
    let key = keyParts.join('/');
    key = key.substring(0, key.lastIndexOf('.')); // Remove the file extension
    try {
        await s3.headObject({ Bucket: bucket, Key: key }).promise();
        return true;
    } catch (error) {
        if (error.code === 'NotFound') {
            return false;
        }
        throw error;
    }
}

async function extractClipData(storylineId) {
    const data = await Storyline.findById(storylineId);
    let results = [];
    let nonExistingClips = []; // Initialize array for non-existing clips

    const proxyUrisMap = await Moment.getProxyUrisMap();

    for (const [index, part] of data.structure.entries()) {
        let block = {
            partType: part.type,
            orderIndex: index,
            clips: []
        };

        for (const [clipIndex, clip] of part.clips.entries()) {
            let clipData = {
                orderIndex: `${index}.${clipIndex}`,
                type: clip.type,
                partType: part.type,
                promptId: part.promptId,
                momentId: clip.momentId,
                length: parseInt(clip.clipLength),
                cutSpeed: part.clipPace.type === 'fixed' ? 'flexible' : part.clipPace.type,
                proxyUri: null,
                s3Exists: false,
            };

            const proxyUris = proxyUrisMap[clipData.momentId];
            if (proxyUris) {
                clipData.proxyUri = proxyUrisMap[clipData.momentId.toString()];
                clipData.s3Exists = await checkS3FileExists(clipData.proxyUri);

                if (!clipData.s3Exists) {
                    nonExistingClips.push({ orderIndex: clipData.orderIndex, momentId: clipData.momentId });
                }
            } 
            block.clips.push(clipData);
        }
        results.push(block);
    }

    // Output the list of clips that don't exist in S3
    if (nonExistingClips.length > 0) {
        console.log("Warning: Clips not found in S3:", nonExistingClips);
    } else {
        console.log("All clips exist in S3.");
    }

    return results;
}

export default extractClipData;

// Uncomment the following code to run the script directly
/*
// Get the extracted clip data
extractClipData('666889732051e77f4aee4ae8').then(clipData => {
    console.log(JSON.stringify(clipData, null, 2));
}).catch(error => {
    console.error('Error extracting clip data:', error);
});
*/
