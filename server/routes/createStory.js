import express from 'express';
import Storyline from '../models/storylineModel.js'; // Import your Storyline model
import {openai } from '../services/openAiAssistant.js'; // Import OpenAI assistant service
import generateStoryName from '../utils/generateStoryName.js'; // Utility function to generate random story names

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        // Generate a random story name
        const storyName = generateStoryName();

        // Create a new thread in OpenAI
        const openAiThread = await openai.beta.threads.create();
        console.log();
        const threadId = openAiThread.data.id;

        // Create a new story in the database
        const newStory = new Storyline ({
            storyName,
            threadId,
            // other fields as necessary
        });

        // Save the new story
        const savedStory = await newStory.save();

        res.status(201).json({ message: 'Story created successfully', savedStory });
    } catch (error) {
        console.error('Error creating a new story:', error);
        res.status(500).send('Error creating a new story');
    }
});

export default router;
