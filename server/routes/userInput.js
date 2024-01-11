import express from 'express';
import { openai } from '../services/openAiAssistant.js';
import { findThreadByStoryId, pollRunStatus } from '../utils/userInputUtils.js';
import { addMessageToThread, createRun, checkRun, retrieveNewMessagesFromThread, submitToolOutputs } from '../utils/assistantFunctions.js';
import { StorylineDirectorAssistantv1 } from '../services/assistants.js';
import { instructions } from '../prompts/assistantInstructions.js';
import storyEngine from '../middleware/storylineEngine/storyEngine.js';

const router = express.Router();

// Route to handle user input
router.post('/', async (req, res) => {
    const { message, storyId, templateName } = req.body;

    console.log(`POST request received. User input: ${message}, storyId: ${storyId}`);

    try {
        // Find the thread ID for the story
        const threadId = await findThreadByStoryId(storyId);

        // Create or access the thread (logic to be implemented)
        await addMessageToThread(message, threadId);

        // Run the Thread on the Assistant and capture the run object
        const run = await createRun(threadId, StorylineDirectorAssistantv1);
        console.log('Run created:', run);

        // Poll the run status
        const finalRunStatus = await pollRunStatus(threadId, run.id);
        console.log('Final run status:', finalRunStatus.status)

        // Check the final status of the run
        if (finalRunStatus.status === 'requires_action' || finalRunStatus.status === 'queued') {
            const toolCallId = finalRunStatus.required_action.submit_tool_outputs.tool_calls[0].id;
            console.log('tool_call_id:', toolCallId);
            const results = await storyEngine(instructions, storyId, threadId, templateName);
            console.log('storyEngine Successful.', results);
            const toolOutputs = submitToolOutputs(threadId, run.id, [toolCallId]);
            console.log('Tool outputs submitted', toolOutputs);
            return res.status(200).json({ message: 'NavigatetoCapture' });

            // ... (handle action required)
        } else if (finalRunStatus.status === 'cancelled' || finalRunStatus.status === 'failed') {
            // Handle the case where the run has been cancelled or failed
            console.error('Run cancelled or failed');
            // ... (handle error)
        } else if (finalRunStatus.status === 'completed') {
            // ... (handle completion)
        }

        // Retrieve new messages from the thread with a possible delay
        const startTime = Date.now();
        const lastResponse = await retrieveNewMessagesFromThread(threadId);
        const endTime = Date.now();

        const responseTime = endTime - startTime;
        console.log(lastResponse);
        console.log(`Response time: ${responseTime} ms`);
        // Forward the assistant's immediate response to keep the interaction responsive
        res.json({ lastResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error processing user input');
    }
});

export default router;
