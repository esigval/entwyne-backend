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
        const thumbnailUrl = await Twyne.getThumbnailByTwyneId(req.params.twyneId);
        if (!thumbnailUrl) {
            return res.status(404).json({ error: 'Twyne not found' });
        }
        const keyWithExtension = thumbnailUrl.replace('s3://', '').split('/').slice(1).join('/');
        const mimeType = keyWithExtension.endsWith('.png') ? 'image/png' : 'image/jpeg';

        // Assuming thumbnailUrl is a direct S3 URL or similar
         // Remove 's3://' and the bucket name
        const presignedUrlFunction = universalPreSignedUrl(currentConfig.TWYNE_BUCKET);
        const presignedUrl = await presignedUrlFunction('getObject', keyWithExtension, mimeType); // Assuming the images are JPEGs
        res.json({ presignedUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get presigned URL' });
    }
});

export default router;