import Moment from '../../models/momentModel.js';
import { config } from '../../config.js';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
dotenv.config();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const updateMomentWithS3Uris = async (req, res, next) => {
    try {
        console.log('updateMomentWithS3Uris');
        console.log('req.s3Keys:', req.s3Keys);
        let promptId = req.s3Keys.promptId;
        const mimeType = req.s3Keys.mimeType;
        const momentId = req.s3Keys.momentId;
        console.log('momentId:', momentId);
        console.log('promptId:', promptId);
        console.log('mimeType:', mimeType);

        const moment = await Moment.findById(momentId);
        const { audioKey, videoKey, imageKey, thumbnailKey, proxyKey } = moment;

        // Convert promptId to an ObjectId if it's not already one
        if (!(promptId instanceof ObjectId)) {
            promptId = new ObjectId(promptId);
        }

        // Determine the file extension based on the mimeType
        let fileExtension;
                switch (mimeType) {
                    case 'video/mp4':
                        fileExtension = 'mp4';
                        break;
                    case 'video/mov':
                    case 'video/quicktime':
                        fileExtension = 'mov';
                        break;
                    case 'image/jpeg':
                        fileExtension = 'jpeg';
                        break;
                    case 'image/png':
                        fileExtension = 'png';
                        break;
                    case 'image/gif':
                        fileExtension = 'gif';
                        break;
                    default:
                        throw new Error('Unsupported mimeType');
                }

        // Construct the S3 URIs
        const audioUri = `s3://${currentConfig.MEZZANINE_BUCKET}/${audioKey}.pcm`;
        const inputUri = `s3://${currentConfig.INPUT_BUCKET}/${mimeType.startsWith('video') ? videoKey : imageKey}.${fileExtension}`;
        const thumbnailUri = `s3://${currentConfig.MEZZANINE_BUCKET}/${thumbnailKey}.png`;
        const proxyUri = `s3://${currentConfig.MEZZANINE_BUCKET}/${proxyKey}.mp4`;

        // Create the update object based on the mimeType
        const update = {
            audioUri,
            thumbnailUri,
            proxyUri,
            associatedPromptId: promptId,
            processed: false
        };
        
        if (mimeType.startsWith('video')) {
            update.videoUri = inputUri;
        } else if (mimeType.startsWith('image')) {
            update.imageUri = inputUri;
        }

        // Update the moment
        await Moment.updateMoment({
            momentId,
            update
        });

        next();
    } catch (error) {
        console.error('Error in updateMomentWithS3Uris:', error);
        next(error);
    }
};

export default updateMomentWithS3Uris;
