import express from 'express';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import { addMessageToThread } from '../middleware/userInput/assistantFunctions/functions.js';
import createAndManageRunStream from '../middleware/userInput/assistantFunctions/createStreamingRunEnhanced.js';
import Twyne from '../models/twyneModel.js';  // Assuming import path
import Story from '../models/storyModel.js';  // Assuming import path
import dotenv from 'dotenv';
import createThread from '../middleware/userInput/assistantFunctions/createThread.js';

dotenv.config();

const router = express.Router();

router.post('/', validateTokenMiddleware, async (req, res) => {
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
        }
    }

    // Add initial message to thread
    await addMessageToThread(message, threadId);

    try {
        let results = await createAndManageRunStream(threadId, assistantId, userId, twyneId, storyId);
        let filteredResults = results.filter(result => result.type === 'textDone');
        let contentValues = filteredResults.map(result => result.data.content.value);
        // Handle successful completion of the run

        // Final response sent back to the client
        res.json({
            status: 'run_completed',
            message: 'Run completed and all events handled.',
            threadId: threadId,
            results: contentValues,
        });
    } catch (error) {
        console.error('Error during run management:', error);
        // Handle errors appropriately

        // Error response sent back to the client
        res.status(500).json({
            status: 'run_failed',
            message: 'An error occurred during the run.',
            error: error.message
        });
    }
});

export default router;
