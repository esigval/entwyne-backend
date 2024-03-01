import express from 'express';
import Prompt from '../models/promptModel.js'; // Make sure this points to your new class file
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // Import the middleware
import { ObjectId } from 'mongodb';

const router = express.Router();

router.delete('/:id', validateTokenMiddleware, async (req, res) => { // Changed to delete method
    try {
        const userId = new ObjectId(req.userId);
        const promptId = req.params.id; // Get the promptId from the request params

        // Delete the prompt in the database using the static delete method
        const deletePrompt = await Prompt.deleteByPromptId(promptId, userId);
        console.log('deletePrompt:', deletePrompt);

        res.status(200).json({ message: 'Prompt deleted successfully', deletePrompt });
    } catch (error) {
        console.error('Error deleting the prompt:', error);
        res.status(500).send('Error deleting the prompt');
    }
});

export default router;