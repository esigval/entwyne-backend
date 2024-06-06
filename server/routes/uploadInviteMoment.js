import express from 'express';
import universalPreSignedUrl from '../middleware/presignedUrls/universalPreSignedUrl.js';
import createInviteMomentAndGenerateS3Keys from '../middleware/moments/createMomentAndGenerateS3Keys.js';
import updateMomentWithS3Uris from '../middleware/moments/updateMoment.js';
import setPromptCollected from '../middleware/prompts/setPromptCollected.js';
import setMomentIdPrompt from '../middleware/prompts/setMomentIdPrompt.js';
import { config } from '../config.js';
import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const router = express.Router();

// Adjusted router code to pass the keys correctly

router.get('/:promptId/', async (req, res, next) => {
    try {
        await createInviteMomentAndGenerateS3Keys(req, res, next);

        console.log('Public Hit');
        const mimeType = req.query.mimeType;
        console.log('MIME type:', mimeType);

        const { videoKey, imageKey } = req.s3Keys;

        if (videoKey) {
            req.videoPreSignedUrl = await universalPreSignedUrl(currentConfig.MEZZANINE_BUCKET)('putObject', videoKey, mimeType);
        } else if (imageKey) {
            req.imagePreSignedUrl = await universalPreSignedUrl(currentConfig.MEZZANINE_BUCKET)('putObject', imageKey, mimeType);
        } else {
            res.status(400).json({ error: 'No valid key found' });
            return;
        }

        await updateMomentWithS3Uris(req, res, next);
        await setPromptCollected(req, res, next);
        await setMomentIdPrompt(req, res, next);

        const response = {};
        if (req.audioPreSignedUrl) response.audioUrl = req.audioPreSignedUrl;
        if (req.videoPreSignedUrl) response.videoUrl = req.videoPreSignedUrl;
        if (req.imagePreSignedUrl) response.imageUrl = req.imagePreSignedUrl;
        res.send(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;