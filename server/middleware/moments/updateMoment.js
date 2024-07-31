import Moment from '../../models/momentModel.js';
import { config } from '../../config.js';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
dotenv.config();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const updateMomentWithS3Uris = async (req, res, next) => {

    try {
        let { promptId } = req.params;

        const momentId = req.s3Keys.momentId;

        // Convert promptId to an ObjectId if it's not already one
        if (!(promptId instanceof ObjectId)) {
            promptId = new ObjectId(promptId);
        }

        // Construct the S3 URIs
        const audioUri = `s3://${currentConfig.MEZZANINE_BUCKET}/${req.s3Keys.audioKey}.pcm`;
        const videoUri = `s3://${currentConfig.MEZZANINE_BUCKET}/${req.s3Keys.videoKey}.mp4`;
        const thumbnailUri = `s3://${currentConfig.MEZZANINE_BUCKET}/${req.s3Keys.thumbnailKey}.png`;
        const proxyUri = `s3://${currentConfig.MEZZANINE_BUCKET}/${req.s3Keys.proxyKey}.mp4`;

        // Update the moment
        await Moment.updateMoment({
            momentId,
            update: {
                audioUri,
                videoUri,
                thumbnailUri,
                proxyUri,
                associatedPromptId: promptId,
                processed: false
            }
        });
        next();
    } catch (error) {
        console.error('Error in updateMomentWithS3Uris:', error);
        next(error);
    }
};

export default updateMomentWithS3Uris;