import Storyline from '../../models/storylineModel.js';
import Moment from '../../models/momentModel.js';
import checkMomentExistsS3 from '../moments/checkMomentProcessingStatusS3.js';

/**
 * Checks the media integrity of specific moments in a storyline.
 *
 * @param {string} storylineId - The ID of the storyline.
 * @returns {Promise<Object[]>} - Returns an array of unprocessed moments.
 */
const checkSpecificMediaIntegrity = async (storylineId) => {
    const storyline = await Storyline.findById(storylineId);
    if (!storyline) {
        throw new Error(`No storyline found with ID ${storylineId}`);
    }

    const unprocessedMoments = [];

    for (const part of storyline.structure) {
        if (!part.clipsExist) {
            for (const clip of part.clips) {
                const moment = await Moment.findById(clip.momentId);
                if (!moment) {
                    continue;
                }

                const pendingUrls = [moment.thumbnailUri, moment.proxyUri, moment.audioUri].filter(Boolean);
                const isProcessed = await checkMomentExistsS3(pendingUrls);

                if (!isProcessed) {
                    unprocessedMoments.push({ partId: `${part.part}_${part.order}`, clipId: clip.id, momentId: moment._id });
                } else if (!moment.processed) {
                    await Moment.updateOne({ _id: moment._id }, { processed: true });
                }
            }
        }
    }
    return unprocessedMoments;
};

export default checkSpecificMediaIntegrity;
