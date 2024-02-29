import express from 'express';
import Story from '../models/storyModel.js'; // Make sure this points to your new class file
import { openai } from '../services/openAiAssistant.js';
import generateStoryName from '../utils/generateStoryName.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // Import the middleware
import { ObjectId } from 'mongodb';

const router = express.Router();

router.post('/', validateTokenMiddleware, async (req, res) => { // Add the middleware here
    try {
        const storyName = generateStoryName();
        const openAiThread = await openai.beta.threads.create();
        const threadId = openAiThread.id;
        console.log(openAiThread);
        const userId = new ObjectId(req.userId);

        // Create a new story in the database using the static create method
        const createStory = await Story.create({
            storyName,
            threadId,
            userId: userId, // Add the userId to the story
            // Include other fields as necessary
        });
        console.log('createStory:', createStory);

        const updatedStory = await Story.findByThreadId(createStory.threadId);
        console.log('updatedStory:', updatedStory);

        res.status(201).json({ message: 'Story created successfully', updatedStory });
    } catch (error) {
        console.error('Error creating a new story:', error);
        res.status(500).send('Error creating a new story');
    }
});

export default router;