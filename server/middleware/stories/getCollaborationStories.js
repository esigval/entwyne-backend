// Goal is to find stories where the userId is a contributor and NOT the creator (userId)

// This middleware is used to get stories where the userId is a contributor and NOT the creator (userId)
import Story from '../../models/storyModel.js';

const getCollaborationStories = async (req, res, next) => {
    try {
        const userId = req.userId;
        const stories = await Story.getCollaborationStories(userId);
        res.stories = stories;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    }

export { getCollaborationStories };