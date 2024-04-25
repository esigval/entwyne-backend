import express from 'express';
import Story from '../models/storyModel.js'; // Import the Story model
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.patch('/:id', validateTokenMiddleware, async (req, res) => {
    try {
        const storyId = req.params.id; // Get the storyId from the request params
        const updateData = req.body; // Get the data to update from the request body

        // Update the story in the database using the static update method
        const result = await Story.update(storyId, updateData);
        console.log('Update result:', result);

        res.status(200).json({ message: 'Story updated successfully', result });
    } catch (error) {
        console.error('Error updating the story:', error);
        res.status(500).send('Error updating the story');
    }
});

export default router;