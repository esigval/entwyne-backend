import express from 'express';
import createPresignedPicturesUrl from '../middleware/presignedUrls/createPicturesPresignedUrl.js';
import Prompts from '../models/promptModel.js';
import Twynes from '../models/twyneModel.js';
import StorylineModel from '../models/storylineModel.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/', async (req, res) => {
    console.log('collecting pictures');
    const { promptId, fileName, fileType } = req.query;
    console.log('promptId', promptId);
    console.log('fileName', fileName);
    console.log('fileType', fileType);
    const bRollShotLength = 5;

    try {
        const { presignedUrl, key } = await createPresignedPicturesUrl(
            process.env.S3_POST_BUCKET_NAME,
            fileName,
            fileType
        );

        // Save the new Twyne to the database
        const storylineId = await Prompts.getStorylineId(promptId);
        const twyneResult = await Twynes.createPictureTwynes({ associatedPromptId: promptId, key, storylineId });
        console.log('Picture Twyne Created:', twyneResult);

        const { updateResult, bRollData } = await StorylineModel.updateBrollWithTwyneId(storylineId, fileType, bRollShotLength, twyneResult._id, twyneResult.s3FilePath, twyneResult.s3Uri);
        console.log('Broll Updated:', bRollData);

        // Return both the presigned URL and the key (or URL) to the client
        res.send({ presignedUrl, key, storylineId, bRollData });
    } catch (err) {
        console.error('Failed Pictures:', err);
        res.status(500).send('Error in collect Pictures');
    }
});

export default router;