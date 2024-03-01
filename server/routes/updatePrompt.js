import express from 'express';
import Prompt from '../models/promptModel.js'; // Make sure this points to your new class file
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // Import the middleware
import { ObjectId } from 'mongodb';

const router = express.Router();

router.patch('/:id', validateTokenMiddleware, async (req, res) => {
    try {
        const userId = new ObjectId(req.userId);
        const promptId = req.params.id; // Get the promptId from the request params
        const updateData = req.body; // Get the data to update from the request body

        // Update the prompt in the database using a static update method
        // You'll need to implement this method in your Prompt model
        const updatedPrompt = await Prompt.updateByPromptId(promptId, userId, updateData);
        console.log('updatedPrompt:', updatedPrompt);

        res.status(200).json({ message: 'Prompt updated successfully', updatedPrompt });
    } catch (error) {
        console.error('Error updating the prompt:', error);
        res.status(500).send('Error updating the prompt');
    }
});

export default router;