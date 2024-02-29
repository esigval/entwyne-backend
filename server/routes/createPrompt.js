import express from 'express';
import Prompt from '../models/promptModel.js'; // Make sure this points to your new class file
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // Import the middleware
import { ObjectId } from 'mongodb';

const router = express.Router();

router.post('/', validateTokenMiddleware, async (req, res) => { // Add the middleware here
    try {
        console.log('req.userId:', req.userId);
        const userId = new ObjectId(req.userId);
        const prompt = req.body; // Corrected here
        console.log('prompt:', prompt);

        // Create a new prompt in the database using the static create method
        const promptData = {
            ...req.body, // Corrected here
            userId, // Add the userId
        };
        const createPrompt = await Prompt.create(promptData);
        console.log('createPrompt:', createPrompt);

        res.status(201).json({ message: 'Prompt created successfully', createPrompt });
    } catch (error) {
        console.error('Error creating a new prompt:', error);
        res.status(500).send('Error creating a new prompt');
    }
});

export default router;