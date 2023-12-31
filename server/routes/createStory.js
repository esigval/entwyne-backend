import express from 'express';
import Storyline from '../models/storylineModel.js'; // Make sure this points to your new class file
import { openai } from '../services/openAiAssistant.js';
import generateStoryName from '../utils/generateStoryName.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const storyName = generateStoryName();
        const openAiThread = await openai.beta.threads.create();
        const threadId = openAiThread.id;
        console.log(openAiThread);

        // Create a new story in the database using the static create method
        const savedStory = await Storyline.create({
            storyName,
            threadId,
            // Include other fields as necessary
        });

        res.status(201).json({ message: 'Story created successfully', savedStory });
    } catch (error) {
        console.error('Error creating a new story:', error);
        res.status(500).send('Error creating a new story');
    }
});

export default router;
