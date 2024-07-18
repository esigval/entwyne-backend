
import express from 'express';
import Twyne from '../../models/twyneModel.js';
import User from '../../models/userModel.js';

const router = express.Router();
// Goal is to find stories where the userId is a contributor and NOT the creator (userId)

// This middleware is used to get stories where the userId is a contributor and NOT the creator (userId)
import Story from '../../models/storyModel.js';

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

const getCollaborationStories = async (req, res, next) => {
    try {
        const userId = req.userId;
        const collaborationStories = await Story.getCollaborationStories(userId);

        const collaborationStoriesWithTwynes = await Promise.all(collaborationStories.map(async (story) => {
            const twynes = await Twyne.listByStoryId(story._id);
            const storyObject = story._doc ? story._doc : story;

            let coCreatorsInfo = [];
            if (Array.isArray(story.coCreators)) {
                coCreatorsInfo = await Promise.all(story.coCreators.map(GetContributorInfo));
                coCreatorsInfo = coCreatorsInfo.filter(info => info !== null);
            }

            const userInfo = await GetContributorInfo(req.userId);
            if (userInfo) {
                coCreatorsInfo.push(userInfo);
            }

            if (Array.isArray(story.contributors)) {
                const contributorsInfo = await Promise.all(story.contributors.map(GetContributorInfo));
                coCreatorsInfo = coCreatorsInfo.concat(contributorsInfo.filter(info => info !== null));
            }

            return { ...storyObject, twynes, coCreatorsInfo };
        }));
        res.stories = collaborationStoriesWithTwynes;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    }

export { getCollaborationStories };