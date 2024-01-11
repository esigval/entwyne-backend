import express from 'express';

const router = express.Router();


router.get('/', async (req, res) => {

    const { threadId, prompts } = req.query;
    
    try {
    const response = await directorReviewAssistant(directorReviewInstructions, threadId, prompts);

    } catch (err) {
        console.error('Failed to get stories:', err);
        res.status(500).send('Error in getStories');
    }
});

export default router;


