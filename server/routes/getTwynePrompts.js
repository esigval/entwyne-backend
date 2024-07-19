import express from 'express';
import Prompts from '../models/promptModel.js';
import Story from '../models/storyModel.js';
import User from '../models/userModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';

const router = express.Router();

// Function to get the firstName, lastName and avatarUrl of the user
async function GetContributorInfo(userId) {
    const user = await User.findById(userId, 'firstName lastName profile.avatarUrl');
    if (!user) {
        return null;
    }

    return {
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.profile.avatarUrl,
        username: user.username,
        email: user.email,
    };
}

router.get('/:twyneId', validateTokenMiddleware, async (req, res) => {
    try {
        const { twyneId } = req.params;
        const userId = req.userId;
        console.log(`Route hit. User ID: ${userId}`);
        
        const prompts = await Prompts.findByTwyneId(twyneId);
        if (!prompts.length) {
            return res.status(404).send('No prompts found for the twyne');
        }

        const updatedPrompts = await Promise.all(prompts.map(async (prompt) => {
            console.log(`Fetching story with ID: ${prompt.storyId}`);
            const story = await Story.findById(prompt.storyId);
            console.log(`Fetched story: ${JSON.stringify(story)}`);
            console.log(`Fetching storyName: ${story.storyName}`)
            const userInfo = await GetContributorInfo(userId);
        
            // Check if prompt.contributors is defined and is an array
            let contributorsInfo = [];
            if (Array.isArray(prompt.contributors)) {
                // Get the firstName, lastName and avatar URL for each contributor
                contributorsInfo = await Promise.all(prompt.contributors.map(GetContributorInfo));
            }
        
            return {
                ...prompt,
                storyName: story ? story.storyName : 'unassigned',
                contributorsInfo,
                userInfo
            };
        }));

        res.json(updatedPrompts);
    } catch (err) {
        console.error('Failed to get prompts:', err);
        res.status(500).send('Error in getPrompts');
    }
});

export default router;