import express from 'express';
import createPresignedPicturesUrl from '../middleware/presignedUrls/createPicturesPresignedUrl.js';
import Prompts from '../models/promptModel.js'; 
import Twynes from '../models/twyneModel.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/', async (req, res) => {
    console.log('collecting pictures');
    const { promptId, fileName, fileType } = req.query;
    console.log('promptId', promptId);
    console.log('fileName', fileName);
    console.log('fileType', fileType);

    try {
        const { presignedUrl, key } = await createPresignedPicturesUrl(
            process.env.S3_POST_BUCKET_NAME,
            fileName, 
            fileType
        );

        // Save the new Twyne to the database
        const storylineId = await Prompts.getStorylineId(promptId);
        const result = await Twynes.createPictureTwynes({ associatedPromptId: promptId, key, storylineId });
        console.log('Picture Twyne Created', result);

        // Return both the presigned URL and the key (or URL) to the client
        res.send({ presignedUrl, key, storylineId });

    } catch (err) {
        console.error('Failed Pictures:', err);
        res.status(500).send('Error in collect Pictures');
    }
});

export default router;
