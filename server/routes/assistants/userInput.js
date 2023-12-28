import express from 'express';
import openai from '../../services/openAiAssistant';

const router = express.Router();

// Route to handle user input
router.post('/user-input', async (req, res) => {
    const { input: userInput, threadId } = req.body;

    try {
        // Create or access the thread (logic to be implemented)
        const thread = await manageThread(threadId, userInput);

        // Send input to OpenAI Assistant and get response (implementation needed)
        const assistantResponse = await openai.sendInput(userInput, thread.context);

        // Forward the assistant's immediate response to keep the interaction responsive
        res.json({ assistantResponse });
    } catch (error) {
        res.status(500).send('Error processing user input');
    }
});

export default router;
