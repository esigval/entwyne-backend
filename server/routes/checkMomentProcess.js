import express from 'express';
import Moment from '../models/momentModel.js'; // Adjust the path to your Moment model file
import Story from '../models/storyModel.js'; // Adjust the path to your Story model file
import directorReviewAssistant from '../middleware/assistants/directorReviewAssistant.js';
import sentimentAnalysisAssistant from '../middleware/assistants/sentimentAnalysisAssistant.js';
import directorReviewScoreAssistant from '../middleware/assistants/directorReviewScoreAssistant.js';
import { directorReviewInstructions, sentimentAnalysisAssistantInstructions,directorReviewScoreAssistantInstructions } from '../prompts/assistantInstructions.js';

const router = express.Router();

// Route to analyze a moment if transcription is completed.
router.get('/', async (req, res) => {
    console.log('checkMomentProcess route hit');

    const momentId = req.query.newMomentId;
    const storyId = req.query.storyId;
    console.log('storyId:', storyId)
    const threadId = await Story.findThreadByStoryId(storyId);
    const prompts = req.query.prompts;
    console.log('momentId:', momentId);

    try {
        const moment = await Moment.findByMomentIdWithDetails(momentId);

        if (moment) {
            console.log('sending to director review assistant');
            const [directorReview, sentimentAnalysis, directorReviewScore] = await Promise.all([
                directorReviewAssistant(directorReviewInstructions, threadId, prompts, moment.transcription),
                sentimentAnalysisAssistant(sentimentAnalysisAssistantInstructions, moment.transcription),
                directorReviewScoreAssistant(directorReviewScoreAssistantInstructions, threadId, prompts, moment.transcription),
            ]);
            console.log('directorReview:', directorReview);
            console.log('sentimentAnalysis:', sentimentAnalysis);
            console.log('directorReviewScore:', directorReviewScore);
            // Return the associatedPromptId if the moment has both transcription and thumbnailUrl
            res.json({
                promptId: moment.associatedPromptId,
                thumbnailUrl: moment.thumbnailUrl,
                transcription: moment.transcription,
                directorReview: directorReview,
                sentimentAnalysis: sentimentAnalysis,
                directorReviewScore: directorReviewScore,
                promptDetail: prompts,
            });
        } else {
            // If moment does not have both transcription and thumbnailUrl
            res.status(404).send('Required details not found for the given Moment');
        }
    } catch (error) {
        console.error('Error in checking moment:', error);
        res.status(500).send('Error checking moment');
    }
});

export default router;
