import express from 'express';
import universalPreSignedUrl from '../middleware/presignedUrls/universalPreSignedUrl.js';

import checkMomentProcessing from '../middleware/prompts/checkMomentProcessing.js';
import createMomentAndGenerateS3Keys from '../middleware/moments/createMomentAndGenerateS3Keys.js';
import updateMomentWithS3Uris from '../middleware/moments/updateMoment.js';
import setPromptCollected from '../middleware/prompts/setPromptCollected.js';
import setMomentIdPrompt from '../middleware/prompts/setMomentIdPrompt.js';
import checkStorylineComplete from '../middleware/storyline/checkStorylineComplete.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import { config } from '../config.js';
import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const router = express.Router();

const generatePreSignedUrl = async (bucket, key, type) => {
    try {
        return await universalPreSignedUrl(bucket)('putObject', key, type);
    } catch (err) {
        throw new Error(`Error generating ${type} pre-signed URL`);
    }
};

// Adjusted router code to pass the keys correctly

router.get('/:promptId', validateTokenMiddleware, createMomentAndGenerateS3Keys, 
    async (req, res, next) => {
        try {
            req.audioPreSignedUrl = await generatePreSignedUrl(currentConfig.MEZZANINE_BUCKET, req.s3Keys.audioKey, 'audio/wav');
            req.videoPreSignedUrl = await generatePreSignedUrl(currentConfig.INPUT_BUCKET, req.s3Keys.videoKey, 'video/mp4');
            req.thumbnailPreSignedUrl = await generatePreSignedUrl(currentConfig.MEZZANINE_BUCKET, req.s3Keys.thumbnailKey, 'image/png');
            req.proxyPreSignedUrl = await generatePreSignedUrl(currentConfig.MEZZANINE_BUCKET, req.s3Keys.proxyKey, 'video/mp4');
            next();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    updateMomentWithS3Uris,
    (req, res, next) => {
        req.params.status = "true"; // always true if successful
        next();
    },
    setPromptCollected,
    checkStorylineComplete,
    setMomentIdPrompt,

    (req, res) => {
        res.send({ 
            audioUrl: req.audioPreSignedUrl, 
            videoUrl: req.videoPreSignedUrl, 
            thumbnailUrl: req.thumbnailPreSignedUrl,
            proxyUrl: req.proxyPreSignedUrl // Send the proxy URL in the response
        });
    }
);

export default router;