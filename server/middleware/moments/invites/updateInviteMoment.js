import Moment from '../../../models/momentModel.js';
import { config } from '../../../config.js';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
dotenv.config();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const updateInviteMomentWithS3Uris = async (req, res, next) => {
    let { promptId } = req.params;
    const momentId = req.s3Keys.momentId;
    const mimeType = req.query.mimeType;
    console.log('momentId:', momentId);

    // Convert promptId to an ObjectId if it's not already one
    promptId = new ObjectId(promptId);

    // Get the extension for the MIME type
    const extension = mime.extension(mimeType);

    // construct the S3 URIs
    const update = { associatedPromptId: promptId };
    if (mimeType.startsWith('audio/')) {
        update.audioUri = `s3://${currentConfig.MEZZANINE_BUCKET}/${req.s3Keys.audioKey}.${extension}`;
    } else if (mimeType.startsWith('video/')) {
        update.videoUri = `s3://${currentConfig.MEZZANINE_BUCKET}/${req.s3Keys.videoKey}.${extension}`;
        update.proxyUri = `s3://${currentConfig.MEZZANINE_BUCKET}/${req.s3Keys.proxyKey}.${extension}`;
    } else if (mimeType.startsWith('image/')) {
        update.thumbnailUri = `s3://${currentConfig.MEZZANINE_BUCKET}/${req.s3Keys.thumbnailKey}.${extension}`;
    }

    // update the moment
    await Moment.updateMoment({ momentId, update });

    next();
};

export default updateInviteMomentWithS3Uris;