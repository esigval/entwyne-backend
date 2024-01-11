import express from 'express';
import Twyne from '../models/twyneModel.js'; // Adjust the path to your Twyne model file
import Story from '../models/storyModel.js'; // Adjust the path to your Story model file
import directorReviewAssistant from '../middleware/assistants/directorReviewAssistant';
import { directorReviewInstructions } from '../prompts/assistantInstructions.js';

const router = express.Router();

// Route to create a new thread
router.get('/', async (req, res) => {
    console.log('checkMomentProcess route hit');


    const twyneId = req.query.newTwyneId;
    const storyId = req.query.storyId;
    const threadId = await Story.findThreadIdByStoryId(storyId);
    const prompts = req.query.prompts;
    console.log('twyneId:', twyneId);

    try {
        const twyne = await Twyne.findByTwyneIdWithDetails(twyneId);

        if (twyne) {
            const result = await directorReviewAssistant(directorReviewInstructions, threadId, prompts);
            // Return the associatedPromptId if the twyne has both transcription and thumbnailUrl
            res.json({
                promptId: twyne.associatedPromptId,
                thumbnailUrl: twyne.thumbnailUrl,
                transcription: twyne.transcription
            });
        } else {
            // If twyne does not have both transcription and thumbnailUrl
            res.status(404).send('Required details not found for the given Twyne');
        }
    } catch (error) {
        console.error('Error in checking moment:', error);
        res.status(500).send('Error checking moment');
    }
});

export default router;
