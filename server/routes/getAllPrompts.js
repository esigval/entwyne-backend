import express from 'express';
import Prompts from '../models/promptModel.js'; // Make sure to import the Prompts class
import Story from '../models/storyModel.js'; // Make sure to import the Story class
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';

const router = express.Router();

router.get('/', validateTokenMiddleware, async (req, res) => {
    try {
        const userId = req.userId; // Extract the userId from the request
        console.log(`Route hit. User ID: ${userId}`);
        
        const prompts = await Prompts.findByUserId(userId); // Assume this returns an array of prompts
        if (!prompts.length) {
            return res.status(404).send('No prompts found for the user');
        }

        // Optimize by fetching all required stories at once if possible.
        // For demonstration, we fetch stories individually for clarity.
        const updatedPrompts = await Promise.all(prompts.map(async (prompt) => {
            const story = await Story.findById(prompt.storyId);
            // Include the story name in each prompt object.
            return {
                ...prompt,
                storyName: story ? story.storyName : 'unassigned'
            };
        }));

        res.json(updatedPrompts);
    } catch (err) {
        console.error('Failed to get prompts:', err);
        res.status(500).send('Error in getPrompts');
    }
});

export default router;
