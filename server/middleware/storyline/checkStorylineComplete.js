import Storyline from '../../models/storylineModel.js';
import Twyne from '../../models/twyneModel.js';
import Prompts from '../../models/promptModel.js';
import checkSpecificMediaIntegrity from './checkSpecificMediaIntegrity.js';
import checkMomentProcessing from '../prompts/checkMomentProcessing.js';
import { processTwyne } from '../renderEngine/processTwyne.js';
import findAlternativeValidMoments from './findAlternativeValidMoments.js';

const checkStorylineComplete = async (req, res, next) => {
    const promptId = req.s3Keys.promptId;
    const userId = req.userId;

    try {
        const storylineId = await Prompts.getStorylineId(promptId);
        const storyline = await Storyline.findById(storylineId);
        const twyne = await Twyne.findById(storyline.twyneId);

        if (!storyline) {
            return res.status(404).send('Storyline not found');
        }

        if (storyline.progress === 100) {
            if (!storyline.mediaIntegrityCheck) {
                console.log('Starting independent media integrity check...');
                checkMediaIntegrityInBackground(storylineId, promptId, twyne, userId);
            } else {
                console.log('Media integrity check passed, rendering video...');
                renderVideoInBackground(twyne, userId);
            }
        }
        
        next();
    } catch (error) {
        console.error('Error in checkStorylineComplete middleware:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const checkMediaIntegrityInBackground = (storylineId, promptId, twyne, userId) => {
    const maxRetries = 5;
    let retryCount = 0;

    const retryCheck = async () => {
        if (retryCount >= maxRetries) {
            console.error('Media integrity check failed after multiple attempts');
            return;
        }

        retryCount++;
        checkMomentProcessing({ params: { storylineId } }, {}, async (error, allProcessed) => {
            if (error) {
                console.error('Error checking moment processing:', error);
                return;
            }
            if (allProcessed) {
                console.log('All moments processed successfully.');
                renderVideoInBackground(twyne, userId);
            } else {
                console.log(`Retrying media integrity check in ${Math.pow(2, retryCount)} seconds...`);
                setTimeout(retryCheck, Math.pow(2, retryCount) * 1000); // Exponential backoff
            }
        });
    };

    setImmediate(async () => {
        try {
            const unprocessedMoments = await checkSpecificMediaIntegrity(storylineId);
            if (unprocessedMoments.length > 0) {
                await findAlternativeValidMoments(storylineId, unprocessedMoments);
            }
            retryCheck();
        } catch (error) {
            console.error('Error in media integrity check:', error);
        }
    });
};

const renderVideoInBackground = (twyne, userId) => {
    setImmediate(() => {
        try {
            if (!twyne.currentRender || twyne.currentRender.length === 0 || twyne.currentRender === null) {
                processTwyne(twyne._id, userId);
            } else {
                console.log('Twyne currentRender is full, skipping rendering.');
            }
        } catch (error) {
            console.error('Error in rendering video:', error);
        }
    });
};

export default checkStorylineComplete;
