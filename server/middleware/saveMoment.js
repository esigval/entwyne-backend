import { connect } from '../db/db.js';
import Moment from '../models/momentModel.js';
import Prompts from '../models/promptModel.js';
import { ObjectId } from 'mongodb'; // Import ObjectId
import { buckets } from '../config.js';

const saveMoment = async (req, res, next) => {
    const { promptId, key, presignedUrl, videoUri } = req;
    let database;
    const strippedKey = key.replace('video', '');
    const jpgKey = strippedKey.replace(/\.[^\.]+$/, '.jpg');
    const storylineId = await Prompts.getStorylineId(promptId);
    console.log(`JPG Key: ${jpgKey}`)

    try {
        database = await connect();


        const collection = database.collection('moments');

        // Convert promptId to ObjectId, handling cases where promptId might be invalid
        let promptIdObjectId;
        if (promptId && ObjectId.isValid(promptId)) {
            promptIdObjectId = new ObjectId(promptId);
        } else {
            // Handle the case where promptId is not provided or invalid
            // You might want to return an error or handle this scenario appropriately
            throw new Error('Invalid or missing promptId');
        }

        const moment = new Moment({
            associatedPromptId: promptIdObjectId, // Use the ObjectId here
            filename: key,
            createdAt: new Date(),
            s3FilePath: `https://${buckets.EXTRACTION_BUCKET}.s3.amazonaws.com/${storylineId}/${key}`,
            s3Uri: `s3://${buckets.EXTRACTION_BUCKET}/${storylineId}/${key}`,
            s3UriThumbnail: `s3://${buckets.THUMBNAIL_BUCKET}/${storylineId}/${key}`,
            thumbnailUrl: `https://${buckets.THUMBNAIL_BUCKET}.s3.amazonaws.com/${storylineId}/${jpgKey}`,
            videoUri: videoUri,
            audioUri: `s3://${buckets.AUDIO_BUCKET}/audio/${key}.flac`,
            storylineId: storylineId,
            beatTag: "narrative",

        });

        const result = await collection.insertOne(moment);
        // Extract the ObjectId of the newly inserted document
        const newMomentId = result.insertedId;
        req.presignedUrl = presignedUrl; // If needed elsewhere in the middleware chain
        console.log(`Successfully inserted item with _id: ${newMomentId}`);
        res.locals.newMomentId = newMomentId;
        next(); // Pass control to the next middleware
    } catch (error) {
        console.error('Error saving Moment:', error);
        res.status(500).send('Internal Server Error');
    }
};

export default saveMoment;
