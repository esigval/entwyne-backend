import express from 'express';
import url from 'url';
import path from 'path';
import universalPreSignedUrl from '../middleware/presignedUrls/universalPreSignedUrl.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import { config } from '../config.js';
import Prompts from '../models/promptModel.js';
import Moments from '../models/momentModel.js';
import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const router = express.Router();

router.get('/:promptId', validateTokenMiddleware, async (req, res) => {
    try {
        const momentId = await Prompts.findMomentIdByPromptId(req.params.promptId);
        if (!momentId) {
            return res.status(404).json({ error: 'Prompt not found' });
        }

        const s3Url = await Moments.findProxyUriById(momentId);

        const keyWithExtension = s3Url.replace('s3://', '').split('/').slice(1).join('/'); // Remove 's3://' and the bucket name
        const key = keyWithExtension.substring(0, keyWithExtension.lastIndexOf('.')); // Remove the extension from the key


        const presignedUrlFunction = universalPreSignedUrl(currentConfig.MEZZANINE_BUCKET);
        const presignedUrl = await presignedUrlFunction('getObject', key, 'audio/mp4');
        res.json({ presignedUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get presigned URL' });
    }
});

export default router;