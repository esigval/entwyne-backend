import express from 'express';
const router = express.Router();
import Story from '../models/storyModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';

router.get('/:storyId', validateTokenMiddleware, async (req, res) => {
    try {
        const story = await Story.findByIdAndUserId(req.params.storyId, req.userId);
        if (story) {
            res.json(story);
        } else {
            res.status(404).send('Story not found or you do not have permission to view it');
        }
    } catch (err) {
        console.error('Failed to get story:', err);
        res.status(500).send('Error in getStory');
    }
});

export default router;