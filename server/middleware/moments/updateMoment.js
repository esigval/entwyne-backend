import Moment from '../../models/momentModel.js';
import { config } from '../../config.js';
import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const updateMomentWithS3Uris = async (req, res, next) => {
    const momentId = req.s3Keys.momentId
    console.log('momentId:', momentId);
    const { audioPreSignedUrl, videoPreSignedUrl } = req;

    // construct the S3 URIs
    const audioUri = `s3://${currentConfig.MEZZANINE_BUCKET}/${req.s3Keys.audioKey}.pcm`;
    const videoUri = `s3://${currentConfig.MEZZANINE_BUCKET}/${req.s3Keys.videoKey}.mp4`;
    // update the moment
    await Moment.updateMoment({ momentId, update: { audioUri, videoUri } });

    next();
};

export default updateMomentWithS3Uris;