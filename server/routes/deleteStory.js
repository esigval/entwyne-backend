import express from 'express';
import { ObjectId } from 'mongodb';
import Story from '../models/storyModel.js';
import deleteThread from '../utils/deleteThread.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // Import the middleware

const router = express.Router();

router.delete('/stories/:id', validateTokenMiddleware, async (req, res) => { // Add the middleware here
    console.log(`DELETE request received for story with id: ${req.params.id}`);
  
    try {
        const id = new ObjectId(req.params.id); // Convert to ObjectId
        const userId = new ObjectId(req.userId); // Convert to ObjectId
        const story = await Story.findByIdAndUserId(id, userId); // Check if the story belongs to the user

        if (!story) {
            return res.status(404).json({ message: 'Story not found or you do not have permission to delete it' });
        }

        const threadId = story.threadId;
        await deleteThread(threadId);
        await Story.deleteOne(id);
        
        res.status(200).json({ message: 'Story deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting story' });
    }
});

export default router;