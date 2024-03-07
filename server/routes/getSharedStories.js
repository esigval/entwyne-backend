import express from 'express';
import Story from '../models/storyModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.get('/', validateTokenMiddleware, async (req, res) => {
    try {
        const userId = new ObjectId(req.userId);
        const sharedStories = await Story.findByCoCreatorId(userId);

        res.status(200).json({ sharedStories });
    } catch (error) {
        console.error('Error getting shared stories:', error);
        res.status(500).send('Error getting shared stories');
    }
});

export default router;