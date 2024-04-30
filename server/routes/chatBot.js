import express from 'express';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import { addMessageToThread, addAssistantMessageToThread } from '../middleware/userInput/assistantFunctions/functions.js';
import createAndManageRunStream from '../middleware/userInput/assistantFunctions/createStreamingRunEnhanced.js';
import Twyne from '../models/twyneModel.js';
import Story from '../models/storyModel.js';
import Storyline from '../models/storylineModel.js';
import dotenv from 'dotenv';
import createThread from '../middleware/userInput/assistantFunctions/createThread.js';
import handleToolCallResults from '../middleware/userInput/serverFunctions/toolCallHandler.js';

dotenv.config();

const router = express.Router();

router.post('/', validateTokenMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        console.log('User ID:', userId);
        const { message, storyId, twyneId } = req.body;

        let threadId, assistantId, existingThread;

        // Determine which type of document we're working with and get or create the threadId.
        if (storyId) {
            console.log(`Handling Story Director. Story ID: ${storyId}`);
            existingThread = await Story.findById(storyId);
            assistantId = process.env.STORY_DIRECTOR_ASSISTANT_ID;
        } else if (twyneId) {
            console.log(`Handling Twyne Director. Twyne ID: ${twyneId}`);
            existingThread = await Twyne.findById(twyneId);
            assistantId = process.env.TWYNE_DIRECTOR_ASSISTANT_ID;
        }

        // Check if an existing thread was found or create a new one if not found.
        if (existingThread && existingThread.threadId) {
            console.log('Existing Thread found.');
            threadId = existingThread.threadId;
        } else {
            console.log('No existing Thread found. Initiating new Thread creation.');
            let thread = await createThread();
            threadId = thread.id;
            console.log('New Thread created:', threadId);

            // Save the new thread ID back to the document
            const update = { threadId: threadId };
            if (storyId) {
                await Story.update(storyId, update);
            } else if (twyneId) {
                await Twyne.update(twyneId, update);

                // Get the Twyne document
                const twyne = await Twyne.findById(twyneId);

                // Check if the Twyne document has a twyneSummary
                if (twyne && twyne.twyneSummary) {
                    console.log('Twyne Summary:', twyne.twyneSummary);

                    // Prepare a message for the assistant
                    const assistantMessage = `This is the summary of the Twyne narrative: ${twyne.twyneSummary}. Please use this as context when interacting with the user.`;

                    // Send the message to the assistant
                    await addAssistantMessageToThread(assistantMessage, threadId);
                }
            }
        }

        if (twyneId) {
            console.log(`Handling Twyne Director. Twyne ID: ${twyneId}`);
            existingThread = await Twyne.findById(twyneId);

            // Check if the existing Twyne has a storyline
            if (existingThread && existingThread.storyline) {
                console.log('Existing Twyne has a storyline.');
                const storylineSummary = await Storyline.getStorylineByTwyneId(twyneId);
                console.log('Storyline Summary:', storylineSummary);

                // Convert the storyline summary to a string
                const storylineString = JSON.stringify(storylineSummary);
                console.log('Storyline Summary:', storylineString);

                // Prepare a message for the assistant
                const assistantMessage = `This is the existing storyline for the Twyne narrative: ${storylineString}. Please use this as context when interacting with the user.`;

                // Send the message to the assistant
                await addAssistantMessageToThread(assistantMessage, threadId);

            } else {
                console.log('Existing Twyne does not have a storyline.');
                // Handle the absence of a storyline here
            }
        }

        // Add initial message to thread85
        await addMessageToThread(message, threadId);

        const { results, toolCallOutputs } = await createAndManageRunStream(threadId, assistantId, userId, twyneId, storyId);
        const filteredResults = results.filter(result => result.type === 'textDone');
        let contentValues = filteredResults.map(result => result.data.content.value);
        const toolCallResults = toolCallOutputs || []; // This is an array of all resolved tool call outputs
        console.log('Tool Call Results:', toolCallResults);

        // Handle the tool call results
        const handledToolCallResults = handleToolCallResults(toolCallResults, threadId, twyneId, storyId);

        // If there is no contentValue, use the result from handleToolCallResults instead
        if (contentValues.length === 0 && handledToolCallResults.length > 0) {
            contentValues = handledToolCallResults.map(result => result.output);
        }

        // Final response includes tool call results
        res.json({
            status: 'run_completed',
            message: 'Run completed and all events handled including tool calls.',
            threadId: threadId,
            results: contentValues,
            toolCalls: toolCallResults  // Send this additional data
        });
    } catch (error) {
        console.error('Error during run management:', error);
        res.status(500).json({
            status: 'run_failed',
            message: 'An error occurred during the run.',
            error: error.message
        });
    }
});

export default router;
