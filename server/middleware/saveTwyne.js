import { connect } from '../db/db.js';
import Twyne from '../models/twyneModel.js';
import { ObjectId } from 'mongodb'; // Import ObjectId

const saveTwyne = async (req, res, next) => {
    const { promptId, key, presignedUrl, videoUri } = req;
    let database;
    const strippedKey = key.replace('video', '');
    const jpgKey = strippedKey.replace(/\.[^\.]+$/, '.jpg');
    console.log(`JPG Key: ${jpgKey}`)

    try {
        database = await connect();
        const collection = database.collection('twynes');

        // Convert promptId to ObjectId, handling cases where promptId might be invalid
        let promptIdObjectId;
        if (promptId && ObjectId.isValid(promptId)) {
            promptIdObjectId = new ObjectId(promptId);
        } else {
            // Handle the case where promptId is not provided or invalid
            // You might want to return an error or handle this scenario appropriately
            throw new Error('Invalid or missing promptId');
        }

        const twyne = new Twyne({
            associatedPromptId: promptIdObjectId, // Use the ObjectId here
            filename: key,
            createdAt: new Date(),
            s3FilePath: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
            s3Uri: `s3://${process.env.S3_BUCKET_NAME}/${key}`,
            s3UriThumbnail: `s3://${process.env.S3_POST_BUCKET_NAME}/thumbnails/${key}`,
            thumbnailUrl: `https://${process.env.S3_POST_BUCKET_NAME}.s3.amazonaws.com/thumbnails${jpgKey}`,
            videoUri: videoUri,

        });

        const result = await collection.insertOne(twyne);
        req.presignedUrl = presignedUrl; // If needed elsewhere in the middleware chain
        console.log(`Successfully inserted item with _id: ${result.insertedId}`);

        next(); // Pass control to the next middleware
    } catch (error) {
        console.error('Error saving Twyne:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (database && database.close) {
            await database.close();
        }
    }
};

export default saveTwyne;
