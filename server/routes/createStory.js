import express from 'express';
import Story from '../models/storyModel.js'; // Make sure this points to your new class file
import { openai } from '../services/openAiAssistant.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // Import the middleware
import { ObjectId } from 'mongodb';

const router = express.Router();

router.post('/', validateTokenMiddleware, async (req, res) => {
    try {
        const { storyName, defaultVideoSettings } = req.body; // Destructure storyName and defaultVideoSettings from request body
        const userId = new ObjectId(req.userId);

        // Create a new story in the database using the static create method
        const createStory = await Story.create({
            storyName,
            userId: userId,
            defaultVideoSettings,

        });
        console.log('createStory:', createStory);

        res.status(201).json({ message: 'Story created successfully', createStory });
    } catch (error) {
        console.error('Error creating a new story:', error);
        res.status(500).send('Error creating a new story');
    }
});

export default router;