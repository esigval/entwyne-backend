import express from 'express';
import Story from '../models/storyModel.js';
import Twyne from '../models/twyneModel.js';
import User from '../models/userModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // replace with the actual path to your middleware
const router = express.Router();

// Function to get the firstName, lastName and avatarUrl of the user
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
        const stories = await Story.findByUserId(req.userId);
        const storiesWithTwynes = await Promise.all(stories.map(async (story) => {
            const twynes = await Twyne.listByStoryId(story._id);
            const storyObject = story._doc ? story._doc : story; // Check if story._doc exists, if not use story

            // Check if story.coCreators is defined and is an array
            let coCreatorsInfo = [];
            if (Array.isArray(story.coCreators)) {
                // Get the firstName, lastName and avatar URL for each co-creator
                coCreatorsInfo = await Promise.all(story.coCreators.map(GetContributorInfo));
                coCreatorsInfo = coCreatorsInfo.filter(info => info !== null); // Filter out null values
            }

            return { ...storyObject, twynes, coCreatorsInfo };
        }));
        res.json(storiesWithTwynes);
    } catch (err) {
        console.error('Failed to get stories:', err);
        res.status(500).send('Error in getStories');
    }
});

export default router;