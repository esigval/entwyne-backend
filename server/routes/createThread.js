import express from 'express';
import { openai } from '../services/openAiAssistant.js'; // Import the OpenAI instance
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';

const router = express.Router();

// Route to create a new thread
router.post('/', validateTokenMiddleware, async (req, res) => {
    try {
        const emptyThread = await openai.beta.threads.create();
        console.log(emptyThread); // Optional, for logging purposes

        res.json(emptyThread);
    } catch (error) {
        console.error('Error creating a new thread:', error);
        res.status(500).send('Error creating a new thread');
    }
});

export default router;
