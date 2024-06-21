import AWS from 'aws-sdk';
import Prompts from '../../../models/promptModel.js';
import Moment from '../../../models/momentModel.js';
import Storyline from '../../../models/storylineModel.js';
import { config } from '../../../config.js';
import setPromptCollectedandStatus from '../../prompts/setPromptCollected.js';

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

// Initialize the S3 client
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

async function deleteMoments(momentIds) {
    try {
        for (const momentId of momentIds) {
            await Moment.deleteOneForce(momentId);
            console.log(`Deleted moment with ID: ${momentId}`);
        }
    } catch (error) {
        console.error('Error deleting moments:', error);
    }
}

async function removeClipsByMomentId(storylineId, momentIds) {
    try {
        for (const momentId of momentIds) {
            const result = await Storyline.removeClipByMomentId(storylineId, momentId);
            if (result) {
                console.log(`Removed clip with moment ID: ${momentId} from storyline: ${storylineId}`);
            } else {
                console.log(`No clip found with moment ID: ${momentId} in storyline: ${storylineId}`);
            }
        }
    } catch (error) {
        console.error('Error removing clips by moment ID:', error);
    }
}

async function removeMomentIdFromPrompts(momentIds) {
    try {
        for (const momentId of momentIds) {
            const result = await Prompts.removeMomentIdFromPrompts(momentId);
            if (result) {
                console.log(`Removed moment ID: ${momentId} from prompts`);
            } else {
                console.log(`No prompt found with moment ID: ${momentId}`);
            }
        }
    } catch (error) {
        console.error('Error removing moment ID from prompts:', error);
    }
}

async function checkS3FileExists(s3Path) {
    const pathWithoutScheme = s3Path.replace('s3://', '');
    const [bucket, ...keyParts] = pathWithoutScheme.split('/');
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

            // Adjust length if cutSpeed is set to flexible
            if (clipData.cutSpeed === 'flexible') {
                clipData.length = 1000; // Set to a big number
            }

            const proxyUris = proxyUrisMap[clipData.momentId];
            if (proxyUris) {
                clipData.proxyUri = proxyUrisMap[clipData.momentId.toString()];
                clipData.s3Exists = await checkS3FileExists(clipData.proxyUri);

                if (!clipData.s3Exists) {
                    nonExistingClips.push({ orderIndex: clipData.orderIndex, momentId: clipData.momentId, promptId: clipData.promptId });
                }
            }
            block.clips.push(clipData);
        }
        results.push(block);
    }

    // If there are any non-existing clips, throw an error
    if (nonExistingClips.length > 0) {
        const momentIds = nonExistingClips.map(clip => clip.momentId);
        await deleteMoments(momentIds);
        await removeClipsByMomentId(storylineId, momentIds);
        await removeMomentIdFromPrompts(momentIds);
        // Extract unique promptIds
        const uniquePromptIds = [...new Set(nonExistingClips.map(clip => clip.promptId))];

        // Set collected status for each unique promptId
        for (const promptId of uniquePromptIds) {
            await Prompts.setCollectedStatus(promptId, "inProgress");
        }

        throw new Error(`Clips not found in S3: ${JSON.stringify(nonExistingClips)}`);
    }

    return results;
}

export default extractClipData;

// Uncomment the following code to run the script directly
/*
// Get the extracted clip data
extractClipData('666c6c3d630867dd329cd2ff').then(clipData => {
    console.log(JSON.stringify(clipData, null, 2));
}).catch(error => {
    console.error('Error extracting clip data:', error);
});

*/