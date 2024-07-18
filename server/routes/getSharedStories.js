import express from 'express';
import Story from '../models/storyModel.js';
import Twyne from '../models/twyneModel.js';
import User from '../models/userModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Function to get the firstName, lastName, and avatarUrl of the user
async function GetContributorInfo(userId) {
    const user = await User.findById(userId, 'firstName lastName profile.avatarUrl username');
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

router.get('/', validateTokenMiddleware, async (req, res) => {
    try {
        const userId = new ObjectId(req.userId);
        const sharedStories = await Story.findByCoCreatorId(userId);

        const sharedStoriesWithTwynes = await Promise.all(sharedStories.map(async (story) => {
            const twynes = await Twyne.listByStoryId(story._id);
            const storyObject = story._doc ? story._doc : story; // Check if story._doc exists, if not use story

            // Check if story.coCreators is defined and is an array
            let coCreatorsInfo = [];
            if (Array.isArray(story.coCreators)) {
                // Get the user info for each co-creator
                coCreatorsInfo = await Promise.all(story.coCreators.map(GetContributorInfo));
                coCreatorsInfo = coCreatorsInfo.filter(info => info !== null); // Filter out null values
            }

            // Get the user info for the userId and add it to coCreatorsInfo
            const userInfo = await GetContributorInfo(req.userId);
            if (userInfo) {
                coCreatorsInfo.push(userInfo);
            }

            // Check if story.contributors is defined and is an array
            if (Array.isArray(story.contributors)) {
                // Get the user info for each contributor and add it to coCreatorsInfo
                const contributorsInfo = await Promise.all(story.contributors.map(GetContributorInfo));
                coCreatorsInfo = coCreatorsInfo.concat(contributorsInfo.filter(info => info !== null)); // Filter out null values and add to coCreatorsInfo
            }

            return { ...storyObject, twynes, coCreatorsInfo };
        }));

        res.status(200).json({ sharedStories: sharedStoriesWithTwynes });
    } catch (error) {
        console.error('Error getting shared stories with twynes:', error);
        res.status(500).send('Error getting shared stories with twynes');
    }
});

export default router;