import express from 'express';
import Story from '../models/storyModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // replace with the actual path to your middleware
const router = express.Router();

router.get('/', validateTokenMiddleware, async (req, res) => {
    try {
        const stories = await Story.findByUserId(req.userId);
        res.json(stories);
    } catch (err) {
        console.error('Failed to get stories:', err);
        res.status(500).send('Error in getStories');
    }
});

export default router;