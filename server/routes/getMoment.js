import express from 'express';
import Moment from '../models/momentModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import universalPresignedUrl from '../middleware/presignedUrls/universalPreSignedUrl.js';
import { config } from '../config.js';
import url from 'url';
import path from 'path';
import checkMomentExistsS3 from '../middleware/moments/checkMomentProcessingStatusS3.js';

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const router = express.Router();

// Utility function to remove extension from the last part of the path
function removeExtensionFromKey(keyWithExtension) {
    const parts = keyWithExtension.split('/');
    const lastPartWithoutExtension = path.parse(parts[parts.length - 1]).name; // Get the name without extension
    parts[parts.length - 1] = lastPartWithoutExtension;
    return parts.join('/');
}

router.get('/:momentId', validateTokenMiddleware, async (req, res) => {
    const { momentId } = req.params;
    try {
        const moment = await Moment.findById(momentId);
        const presignedUrlMiddleware = universalPresignedUrl(currentConfig.MEZZANINE_BUCKET);

        let initialProcessed = moment.processed;

        if (moment.processed === false || moment.processed === undefined) {
            const pendingUrls = [];
            if (typeof moment.thumbnailUri === 'string') {
                pendingUrls.push(moment.thumbnailUri);
            }
            if (typeof moment.proxyUri === 'string') {
                pendingUrls.push(moment.proxyUri);
            }
            if (typeof moment.audioUri === 'string') {
                pendingUrls.push(moment.audioUri);
            }
            const isProcessed = await checkMomentExistsS3(pendingUrls);
            console.log('isProcessed:', isProcessed);

            if (isProcessed === true) {
                const update = { processed: true };
                await Moment.updateMoment({ momentId, update });
                initialProcessed = true; // Update the local variable to reflect the change
            }
        }

        let presignedThumbnailUrl;

        if (typeof moment.thumbnailUri === 'string') {
            const parsedThumbnailUrl = url.parse(new URL(moment.thumbnailUri).pathname);
            const thumbnailKeyWithExtension = parsedThumbnailUrl.path.substring(1); // Remove the leading '/'
            const thumbnailKey = removeExtensionFromKey(thumbnailKeyWithExtension);
            console.log('thumbnailKey:', thumbnailKey);
            try {
                presignedThumbnailUrl = await presignedUrlMiddleware('getObject', thumbnailKey);
            } catch (error) {
                console.error('Failed to get presigned URL:', error);
                return res.status(500).json({ error: 'Failed to get presigned URL' });
            }
        }

        res.json({
            _id: moment._id,
            proxyUri: moment.proxyUri,
            contributor: moment.contributorId,
            associatedPrompt: moment.associatedPromptId,
            createdAt: moment.createdAt,
            lastUpdated: moment.lastUpdated,
            processed: initialProcessed, // Use the initialProcessed variable
            presignedThumbnailUrl,
        });
    } catch (err) {
        console.error('Failed to get moment:', err);
        res.status(500).send('Error in getMoment');
    }
});

export default router;
