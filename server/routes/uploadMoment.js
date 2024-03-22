import express from 'express';
import universalPreSignedUrl from '../middleware/presignedUrls/universalPreSignedUrl.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import { config } from '../config.js';
import createMomentAndGenerateS3Keys from '../middleware/moments/createMomentAndGenerateS3Keys.js';
import updateMomentWithS3Uris from '../middleware/moments/updateMoment.js';

import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const router = express.Router();

// Adjusted router code to pass the keys correctly

router.get('/:promptId', validateTokenMiddleware, createMomentAndGenerateS3Keys, 
    (req, res, next) => {
        const key = req.s3Keys.audioKey;
        universalPreSignedUrl(currentConfig.MEZZANINE_BUCKET)(key, 'audio/wav',req, res, () => {
            req.audioPreSignedUrl = req.preSignedUrl; // Store the audio URL
            next();
        });
    },
    (req, res, next) => {
        const key = req.s3Keys.videoKey;
        universalPreSignedUrl(currentConfig.MEZZANINE_BUCKET)(key, 'video/mp4', req, res, () => {
            req.videoPreSignedUrl = req.preSignedUrl; // Store the video URL
            next();
        });
    },
    updateMomentWithS3Uris,
    (req, res) => {
        res.send({ audioUrl: req.audioPreSignedUrl, videoUrl: req.videoPreSignedUrl });
    }
);


export default router;