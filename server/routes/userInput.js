import express from 'express';
import { openai } from '../services/openAiAssistant.js';
import findThreadByStoryId from '../utils/userInputUtils.js';
import { addMessageToThread, createRun, retrieveNewMessagesFromThread } from '../utils/assistantFunctions.js';
import { StorylineDirectorAssistantv1 } from '../services/assistants.js';

const router = express.Router();

// Route to handle user input
router.post('/', async (req, res) => {
    const { message, storyId } = req.body;

    console.log(`POST request received. User input: ${message}, storyId: ${storyId}`);

    try {
        // Find the thread ID for the story
        const threadId = await findThreadByStoryId(storyId);
        
        // Create or access the thread (logic to be implemented)
        await addMessageToThread(message, threadId);

        // Run the Thread on the Assistant
        await createRun (threadId, StorylineDirectorAssistantv1);

        // Is there a delay here? If so, how long?
        const startTime = Date.now();
        const lastResponse = await retrieveNewMessagesFromThread(threadId);
        const endTime = Date.now();
       

        const responseTime = endTime - startTime;
        console.log(lastResponse);
        console.log(`Response time: ${responseTime} ms`);
        // Forward the assistant's immediate response to keep the interaction responsive
        res.json({ lastResponse });
    } catch (error) {
        res.status(500).send('Error processing user input');
    }
});

export default router;
