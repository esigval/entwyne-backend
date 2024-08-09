import express from 'express';
import AWS from 'aws-sdk';
import universalPreSignedUrl from '../middleware/presignedUrls/universalPreSignedUrl.js';
import checkMomentProcessing from '../middleware/prompts/checkMomentProcessing.js';
import createMomentAndGenerateS3Keys from '../middleware/moments/createMomentAndGenerateS3Keys.js';
import updateMomentWithS3Uris from '../middleware/moments/updateMoment.js';
import setPromptCollected from '../middleware/prompts/setPromptCollected.js';
import setMomentIdPrompt from '../middleware/prompts/setMomentIdPrompt.js';
import checkS3Exists from '../middleware/moments/checkS3Exists.js';
import checkStorylineComplete from '../middleware/storyline/checkStorylineComplete.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import { config } from '../config.js';
import dotenv from 'dotenv';

dotenv.config();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const router = express.Router();
const s3 = new AWS.S3({
    region: currentConfig.AWS_REGION,
    accessKeyId: currentConfig.AWS_ACCESS_KEY_ID,
    secretAccessKey: currentConfig.AWS_SECRET_ACCESS_KEY,
});

// Endpoint to initiate multipart upload
router.post('/initiate-multipart-upload/:promptId', validateTokenMiddleware, createMomentAndGenerateS3Keys, async (req, res) => {
    console.log('Initiating multipart upload'); 
    const { promptId } = req.params;
    const { mimeType } = req.body;

    if (!mimeType) {
        return res.status(400).json({ error: 'mimeType is required' });
    }

    const key = mimeType.startsWith('video') ? req.s3Keys.videoKey : req.s3Keys.imageKey;
    const params = {
        Bucket: currentConfig.INPUT_BUCKET,
        Key: key,
        ContentType: mimeType,
    };

    try {
        const data = await s3.createMultipartUpload(params).promise();
        res.json({
            uploadId: data.UploadId,
            key: key,
            videoKey: req.s3Keys.videoKey,
            imageKey: req.s3Keys.imageKey,
            audioKey: req.s3Keys.audioKey,
            thumbnailKey: req.s3Keys.thumbnailKey,
            proxyKey: req.s3Keys.proxyKey,
            momentId: req.s3Keys.momentId,
            mimeType: mimeType,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to get presigned URL for parts
router.post('/get-multipart-presigned-url', validateTokenMiddleware, async (req, res) => {
    const { key, uploadId, partNumber } = req.body;

    const params = {
        Bucket: currentConfig.INPUT_BUCKET,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
        Expires: 600, // 10 minutes
    };

    console.log('Generating presigned URL with params:', params);

    try {
        const url = await s3.getSignedUrlPromise('uploadPart', params);
        console.log('Presigned URL:', url);
        res.json({ url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to list parts of a multipart upload
router.post('/list-parts', validateTokenMiddleware, async (req, res) => {
    const { key, uploadId } = req.body;

    const params = {
        Bucket: currentConfig.INPUT_BUCKET,
        Key: key,
        UploadId: uploadId
    };

    try {
        const data = await s3.listParts(params).promise();
        res.json({ parts: data.Parts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to complete multipart upload
router.post('/complete-multipart-upload', validateTokenMiddleware, async (req, res, next) => {
    const { key, uploadId, parts, momentId, mimeType, promptId } = req.body;
    console.log('Completing multipart upload with key:', key, 'uploadId:', uploadId, 'parts:', parts);

    const params = {
        Bucket: currentConfig.INPUT_BUCKET,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
            Parts: parts,
        },
    };

    console.log('Completing multipart upload with params:', params);

    try {
        const data = await s3.completeMultipartUpload(params).promise();
        console.log('Multipart upload completed:', data);

        // After completing the multipart upload, trigger the remaining middleware
        req.s3Keys = { key, uploadId, momentId, mimeType, promptId }; // Pass necessary info
        console.log('req.s3Keys:', req.s3Keys);
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}, updateMomentWithS3Uris, setPromptCollected, checkStorylineComplete, setMomentIdPrompt, (req, res) => {
    res.json({
        message: 'Multipart upload completed and moment updated successfully.'
    });
});

// Endpoint to check all in progress Multipart uploads
router.get('/check-multipart-uploads', validateTokenMiddleware, async (req, res) => {
    const { key, uploadId } = req.query;

    if (!key || !uploadId) {
        return res.status(400).json({ error: 'Missing key or uploadId' });
    }

    const params = {
        Bucket: currentConfig.INPUT_BUCKET,
    };

    try {
        const data = await s3.listMultipartUploads(params).promise();
        const upload = data.Uploads.find(upload => upload.Key === key && upload.UploadId === uploadId);

        if (upload) {
            res.json({ upload });
        } else {
            res.status(404).json({ error: 'Upload not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/check-S3-file-exists', validateTokenMiddleware, async (req, res) => {
    const { key } = req.query;

    if (!key) {
        return res.status(400).json({ error: 'Key parameter is required' });
    }

    try {
        const exists = await checkS3Exists(key);
        return res.status(200).json({ exists });
    } catch (error) {
        console.error('Error checking S3 file existence:', error);
        return res.status(500).json({ error: 'An error occurred while checking the file existence' });
    }
});


// Existing router code to get presigned URLs for other operations
router.get('/:promptId', validateTokenMiddleware, createMomentAndGenerateS3Keys,
    async (req, res, next) => {
        try {
            const { mimeType } = req.query;

            if (!mimeType) {
                return res.status(400).json({ error: 'mimeType query parameter is required' });
            }

            const videoTypes = ['video/mp4', 'video/mov'];
            const imageTypes = ['image/jpeg', 'image/png', 'image/gif'];

            if (videoTypes.includes(mimeType)) {
                req.videoPreSignedUrl = await generatePreSignedUrl(currentConfig.INPUT_BUCKET, req.s3Keys.videoKey, mimeType);
            } else if (imageTypes.includes(mimeType)) {
                req.imagePreSignedUrl = await generatePreSignedUrl(currentConfig.INPUT_BUCKET, req.s3Keys.imageKey, mimeType);
            } else {
                return res.status(400).json({ error: 'Unsupported mimeType' });
            }

            req.audioPreSignedUrl = await generatePreSignedUrl(currentConfig.MEZZANINE_BUCKET, req.s3Keys.audioKey, 'audio/wav');
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
            imageUrl: req.imagePreSignedUrl,
            thumbnailUrl: req.thumbnailPreSignedUrl,
            proxyUrl: req.proxyPreSignedUrl // Send the proxy URL in the response
        });
    }
);

export default router;
