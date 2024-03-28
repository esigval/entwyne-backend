import express from 'express';
import universalPreSignedUrl from '../middleware/presignedUrls/universalPreSignedUrl.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import { config } from '../config.js';
import createMomentAndGenerateS3Keys from '../middleware/moments/createMomentAndGenerateS3Keys.js';
import updateMomentWithS3Uris from '../middleware/moments/updateMoment.js';
import setPromptCollected from '../middleware/prompts/setPromptCollected.js';
import setMomentIdPrompt from '../middleware/prompts/setMomentIdPrompt.js';

import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const router = express.Router();

// Adjusted router code to pass the keys correctly

router.get('/:promptId', validateTokenMiddleware, createMomentAndGenerateS3Keys, 
    async (req, res, next) => {
        const key = req.s3Keys.audioKey;
        try {
            req.audioPreSignedUrl = await universalPreSignedUrl(currentConfig.MEZZANINE_BUCKET)('putObject', key, 'audio/wav');
            next();
        } catch (err) {
            res.status(500).json({ error: 'Error generating audio pre-signed URL' });
        }
    },
    async (req, res, next) => {
        const key = req.s3Keys.videoKey;
        try {
            req.videoPreSignedUrl = await universalPreSignedUrl(currentConfig.MEZZANINE_BUCKET)('putObject', key, 'video/mp4');
            next();
        } catch (err) {
            res.status(500).json({ error: 'Error generating video pre-signed URL' });
        }
    },
    async (req, res, next) => {
        const key = req.s3Keys.thumbnailKey;
        try {
            req.thumbnailPreSignedUrl = await universalPreSignedUrl(currentConfig.MEZZANINE_BUCKET)('putObject', key, 'image/png');
            next();
        } catch (err) {
            res.status(500).json({ error: 'Error generating thumbnail pre-signed URL' });
        }
    },
    async (req, res, next) => {
        const key = req.s3Keys.proxyKey; // Assuming the key for the proxy is stored in req.s3Keys.proxyKey
        try {
            req.proxyPreSignedUrl = await universalPreSignedUrl(currentConfig.MEZZANINE_BUCKET)('putObject', key, 'video/mp4');
            next();
        } catch (err) {
            res.status(500).json({ error: 'Error generating proxy pre-signed URL' });
        }
    },
    updateMomentWithS3Uris,
    setPromptCollected,
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