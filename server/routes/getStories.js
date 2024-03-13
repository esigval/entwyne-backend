import express from 'express';
import Story from '../models/storyModel.js';
import Twyne from '../models/twyneModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // replace with the actual path to your middleware
const router = express.Router();

router.get('/', validateTokenMiddleware, async (req, res) => {
    try {
        const stories = await Story.findByUserId(req.userId);
        const storiesWithTwynes = await Promise.all(stories.map(async (story) => {
            const twynes = await Twyne.listByStoryId(story._id);
            const storyObject = story._doc ? story._doc : story; // Check if story._doc exists, if not use story
            return { ...storyObject, twynes };
        }));
        res.json(storiesWithTwynes);
    } catch (err) {
        console.error('Failed to get stories:', err);
        res.status(500).send('Error in getStories');
    }
});

export default router;