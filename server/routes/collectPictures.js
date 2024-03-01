import express from 'express';
import createPresignedPicturesUrl from '../middleware/presignedUrls/createPicturesPresignedUrl.js';
import Prompts from '../models/promptModel.js';
import Moments from '../models/momentModel.js';
import StorylineModel from '../models/storylineModel.js';
import dotenv from 'dotenv';
import { buckets } from '../config.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // Import the middleware
dotenv.config();

const router = express.Router();

router.get('/', validateTokenMiddleware, async (req, res) => {
    console.log('collecting pictures');
    const { promptId, fileName, fileType } = req.query;
    console.log('promptId', promptId);
    console.log('fileName', fileName);
    console.log('fileType', fileType);
    const bRollShotLength = 5;

    try {
        const { presignedUrl, key } = await createPresignedPicturesUrl(
            buckets.EXTRACTION_BUCKET,
            fileName,
            fileType
        );

        // Save the new Moment to the database
        const storylineId = await Prompts.getStorylineId(promptId);
        const momentResult = await Moments.createPictureMoments({ associatedPromptId: promptId, key, storylineId });
        console.log('Picture Moment Created:', momentResult);

        const { updateResult, bRollData } = await StorylineModel.updateBrollWithMomentId(storylineId, fileType, bRollShotLength, momentResult._id, momentResult.s3FilePath, momentResult.s3Uri);
        console.log('Broll Updated:', bRollData);

        // Return both the presigned URL and the key (or URL) to the client
        res.send({ presignedUrl, key, storylineId, bRollData });
    } catch (err) {
        console.error('Failed Pictures:', err);
        res.status(500).send('Error in collect Pictures');
    }
});

export default router;