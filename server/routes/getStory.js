import express from 'express';
const router = express.Router();
import Story from '../models/storyModel.js';

router.get('/:storyId', async (req, res) => {
    try {
        const story = await Story.findById(req.params.storyId);
        res.json(story);
    } catch (err) {
        console.error('Failed to get stories:', err);
        res.status(500).send('Error in getStories');
    }
});

export default router;