import express from 'express';
import Prompts from '../models/promptModel.js';
import Story from '../models/storyModel.js';
import User from '../models/userModel.js'; // Make sure to import the User class
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';

const router = express.Router();

// Function to get the first initial of the user's name or username
async function ParseFirstInitial(userId) {
    const user = await User.findById(userId);
    if (!user) {
        return null;
    }

    let initial = user.name ? user.name[0] : user.username[0];
    return {
        initial,
        avatarUrl: user.profile.avatarUrl
    };
}

router.get('/', validateTokenMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        console.log(`Route hit. User ID: ${userId}`);
        
        const prompts = await Prompts.findByUserId(userId);
        if (!prompts.length) {
            return res.status(404).send('No prompts found for the user');
        }

        const updatedPrompts = await Promise.all(prompts.map(async (prompt) => {
            const story = await Story.findById(prompt.storyId);
        
            // Check if prompt.contributors is defined and is an array
            let contributorsInfo = [];
            if (Array.isArray(prompt.contributors)) {
                // Get the first initial and avatar URL for each contributor
                contributorsInfo = await Promise.all(prompt.contributors.map(ParseFirstInitial));
            }
        
            return {
                ...prompt,
                storyName: story ? story.storyName : 'unassigned',
                contributorsInfo
            };
        }));

        res.json(updatedPrompts);
    } catch (err) {
        console.error('Failed to get prompts:', err);
        res.status(500).send('Error in getPrompts');
    }
});

export default router;