import express from 'express';
import universalPreSignedUrl from '../middleware/presignedUrls/universalPreSignedUrl.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import { config } from '../config.js';
import Twyne from '../models/twyneModel.js'; // Assuming Twynes is the model where findTwyneRenderByTwyneId is defined
import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const router = express.Router();

router.get('/:twyneId', validateTokenMiddleware, async (req, res) => {
    try {
        const renderInfo = await Twyne.findCurrentRenderByTwyneId(req.params.twyneId);
        if (!renderInfo) {
            return res.status(404).json({ error: 'Twyne not found' });
        }

        const s3Url = renderInfo; // Assuming the method returns an object with a proxyUri property

        const keyWithExtension = s3Url.replace('s3://', '').split('/').slice(1).join('/'); // Remove 's3://' and the bucket name
        const presignedUrlFunction = universalPreSignedUrl(currentConfig.TWYNE_BUCKET);
        const presignedUrl = await presignedUrlFunction('getObject', keyWithExtension, 'audio/mp4');
        res.json({ presignedUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get presigned URL' });
    }
});

export default router;