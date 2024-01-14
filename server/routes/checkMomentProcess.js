import express from 'express';
import Twyne from '../models/twyneModel.js'; // Adjust the path to your Twyne model file
import Story from '../models/storyModel.js'; // Adjust the path to your Story model file
import directorReviewAssistant from '../middleware/assistants/directorReviewAssistant.js';
import sentimentAnalysisAssistant from '../middleware/assistants/sentimentAnalysisAssistant.js';
import directorReviewScoreAssistant from '../middleware/assistants/directorReviewScoreAssistant.js';
import { directorReviewInstructions, sentimentAnalysisAssistantInstructions,directorReviewScoreAssistantInstructions } from '../prompts/assistantInstructions.js';

const router = express.Router();

// Route to create a new thread
router.get('/', async (req, res) => {
    console.log('checkMomentProcess route hit');


    const twyneId = req.query.newTwyneId;
    const storyId = req.query.storyId;
    console.log('storyId:', storyId)
    const threadId = await Story.findThreadByStoryId(storyId);
    const prompts = req.query.prompts;
    console.log('twyneId:', twyneId);

    try {
        const twyne = await Twyne.findByTwyneIdWithDetails(twyneId);

        if (twyne) {
            console.log('sending to director review assistant');
            const [directorReview, sentimentAnalysis, directorReviewScore] = await Promise.all([
                directorReviewAssistant(directorReviewInstructions, threadId, prompts, twyne.transcription),
                sentimentAnalysisAssistant(sentimentAnalysisAssistantInstructions, twyne.transcription),
                directorReviewScoreAssistant(directorReviewScoreAssistantInstructions, threadId, prompts, twyne.transcription),
            ]);
            console.log('directorReview:', directorReview);
            console.log('sentimentAnalysis:', sentimentAnalysis);
            console.log('directorReviewScore:', directorReviewScore);
            // Return the associatedPromptId if the twyne has both transcription and thumbnailUrl
            res.json({
                promptId: twyne.associatedPromptId,
                thumbnailUrl: twyne.thumbnailUrl,
                transcription: twyne.transcription,
                directorReview: directorReview,
                sentimentAnalysis: sentimentAnalysis,
                directorReviewScore: directorReviewScore,
                promptDetail: prompts,
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
