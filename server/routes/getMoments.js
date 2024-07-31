import express from 'express';
import Moment from '../models/momentModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import universalPresignedUrl from '../middleware/presignedUrls/universalPreSignedUrl.js';
import { config } from '../config.js';
import url from 'url';
import checkMomentExistsS3 from '../middleware/moments/checkMomentProcessingStatusS3.js';
import { removeExtensionFromKey } from '../utils/removeExtensionFromKey.js';

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const router = express.Router();

router.get('/', validateTokenMiddleware, async (req, res) => {
    const userId = req.userId;
    console.log('userId:', userId);
    try {
        const moments = await Moment.listAllByUserId(userId);
        const presignedUrlMiddleware = universalPresignedUrl(currentConfig.MEZZANINE_BUCKET);



        const momentsWithPresignedUrls = await Promise.all(moments.map(async (moment) => {
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
                    await Moment.updateMoment({ moment, update });
                    initialProcessed = true; // Update the local variable to reflect the change
                }
            }
            let presignedThumbnailUrl;
            let presignedProxyUrl;
            console.log('moment.thumbnailUri:', moment.thumbnailUri);

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

            if (typeof moment.proxyUri === 'string') {
                const parsedProxyUrl = url.parse(new URL(moment.proxyUri).pathname);
                const proxyKeyWithExtension = parsedProxyUrl.path.substring(1); // Remove the leading '/'
                const proxyKey = removeExtensionFromKey(proxyKeyWithExtension);
                console.log('proxyKey:', proxyKey);
                try {
                    presignedProxyUrl = await presignedUrlMiddleware('getObject', proxyKey);
                } catch (error) {
                    console.error('Failed to get presigned URL:', error);
                    return res.status(500).json({ error: 'Failed to get presigned URL' });
                }
            }

            return {
                _id: moment._id,
                proxyUri: moment.proxyUri,
                contributor: moment.contributorId,
                associatedPrompt: moment.associatedPromptId,
                createdAt: moment.createdAt,
                lastUpdated: moment.lastUpdated,
                presignedThumbnailUrl,
                presignedProxyUrl,
                transcription: moment.transcription,
                sentiment: moment.sentiment,
                processed: initialProcessed, // Use the initialProcessed variable
            };
        }));

        res.json(momentsWithPresignedUrls);
    } catch (err) {
        console.error('Failed to get moments:', err);
        res.status(500).send('Error in getMoments');
    }
});

export default router;