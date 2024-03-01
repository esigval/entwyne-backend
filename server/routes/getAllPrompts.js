import express from 'express';
import Prompts from '../models/promptModel.js'; // Make sure to import the Prompts class
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';

const router = express.Router();

router.get('/', validateTokenMiddleware, async (req, res) => {
    try {
        const userId = req.userId; // Extract the userId from the request user object
        console.log(`Route hit. User ID: ${userId}`); // Log the message and userId
        const prompts = await Prompts.findByUserId(userId); // Find prompts by userId
        res.json(prompts);
    } catch (err) {
        console.error('Failed to get prompts:', err);
        res.status(500).send('Error in getPrompts');
    }
});

export default router;