import Twyne from '../../models/twyneModel.js';
import User from '../../models/userModel.js';
import Story from '../../models/storyModel.js'; // Assuming there's a Story model

// Middleware for getting a Story from a Twyne

const getStoryFromTwyneMiddleware = async (req, res, next) => {
    try {
        const { twyneId } = req.body;
        if (!twyneId) {
            return res.status(400).json({ message: 'twyneId is required' });
        }

        const twyne = await Twyne.findById(twyneId);
        if (!twyne) {
            return res.status(404).json({ message: 'Twyne not found' });
        }

        const storyId = twyne.storyId;
        if (!storyId) {
            return res.status(404).json({ message: 'Story not found in Twyne' });
        }

        const story = await Story.findById(storyId); // Retrieve the story using its ID
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        req.storyId = storyId; // Attach storyId to the request object
        next(); // Pass control to the next middleware
    } catch (error) {
        console.error('Error getting story from Twyne:', error);
        res.status(500).json({ message: 'Failed to get story from Twyne' });
    }
}

export default getStoryFromTwyneMiddleware;