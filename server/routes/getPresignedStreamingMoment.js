import express from 'express';
import universalPreSignedUrl from '../middleware/presignedUrls/universalPreSignedUrl.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import { config } from '../config.js';
import Prompts from '../models/promptModel.js';
import Moments from '../models/momentModel.js';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const router = express.Router();

router.get('/:momentId', validateTokenMiddleware, async (req, res) => {
    try {
        const s3Url = await Moments.findProxyUriById(momentId);
        if (!moment) {
            return res.status(404).json({ error: 'Moment not found' });
        }

        const keyWithExtension = s3Url.replace('s3://', '').split('/').slice(1).join('/');
        const key = keyWithExtension.substring(0, keyWithExtension.lastIndexOf('.'));
ey

        const presignedUrlFunction = universalPreSignedUrl(currentConfig.MEZZANINE_BUCKET);
        const presignedUrl = await presignedUrlFunction('getObject', key, 'audio/mp4');
        res.json({ presignedUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get presigned URL' });
    }
});

export default router;