import { openai } from '../../../services/openAiAssistant.js';
import { handleToolCallDelta, handleFunctionType, handleToolCallDone } from '../serverFunctions/handlerFunctions.js';
import processNarrative from "../../editingEnginev2/mainDynamicStoryEngine.js";

const createAndManageRunStream = (threadId, assistantId, userId, twyneId, storyId) => {
    console.log('Creating and Managing Run Stream for Thread:', threadId, 'Assistant:', assistantId, 'User:', userId, 'Twyne:', twyneId)
    return new Promise((resolve, reject) => {
        const results = [];
        const eventPromises = [];
        let currentRunId = null;
        const runStream = openai.beta.threads.runs.stream(threadId, { assistant_id: assistantId });

        // Handle Text Creation and Updates
        runStream.on('textCreated', content => {
            console.log('Text Created:', content);
            results.push({ type: 'textCreated', data: content });
        });

        runStream.on('textDelta', (delta, snapshot) => {
            console.log('Text Delta:', delta);
            results.push({ type: 'textDelta', data: { delta, snapshot } });
        });

        runStream.on('textDone', (content, snapshot) => {
            console.log('Text Done:', content);
            results.push({ type: 'textDone', data: { content, snapshot } });
        });

        // Handle Tool Calls
        runStream.on('toolCallCreated', toolCall => {
            console.log('Tool Call Created:', toolCall);
            results.push({ type: 'toolCallCreated', data: toolCall });
        });

        runStream.on('toolCallDelta', (delta, snapshot) => {
            console.log('Tool Call Delta:', delta);
            console.log('threadId:', threadId);
            handleToolCallDelta(delta, snapshot, threadId);
        });

        runStream.on('toolCallDone', (toolCall, snapshot) => {
            const handlerPromise = handleToolCallDone(toolCall, snapshot, userId, twyneId, threadId, processNarrative, currentRunId, storyId);
            eventPromises.push(handlerPromise); // Collect the promise
        });

        // Handle Message Events
        runStream.on('messageCreated', message => {
            console.log('Message Created:', message);
            results.push({ type: 'messageCreated', data: message });
        });

        runStream.on('messageDelta', (delta, snapshot) => {
            console.log('Message Delta:', delta);
            results.push({ type: 'messageDelta', data: { delta, snapshot } });
        });

        runStream.on('messageDone', message => {
            console.log('Message Done:', message);
            results.push({ type: 'messageDone', data: message });
        });

        // Handle Run Steps
        runStream.on('runStepCreated', runStep => {
            console.log('Run Step Created:', runStep);
            currentRunId = runStep.run_id;
            results.push({ type: 'runStepCreated', data: runStep });
        });

        runStream.on('runStepDelta', (delta, snapshot) => {
            console.log('Run Step Delta:', delta);
            results.push({ type: 'runStepDelta', data: { delta, snapshot } });
        });

        runStream.on('runStepDone', runStep => {
            console.log('Run Step Done:', runStep);
            results.push({ type: 'runStepDone', data: runStep });
        });

        // Handle Stream Completion
        runStream.on('end', async () => {
            try {
                // Wait for all asynchronous operations to complete
                await Promise.all(eventPromises);
                console.log('All asynchronous events completed.');
                resolve(results);  // Resolve with all accumulated results
            } catch (error) {
                console.error('Error in processing events:', error);
                reject(error);
            }
        });

        // Handle any errors during the stream
        runStream.on('error', error => {
            console.error('Streaming Error:', error);
            reject(error);  // Reject the promise on errors
        });
    });
};

export default createAndManageRunStream;

// createAndManageRunStream('thread_0ijimswONfkIesuy7r7ra7u8', 'asst_HW7vJdo7CPOjz5ffrebd2Hw9', '660d81337b0c94b81b3f1744', '65f13b5b3c54a131c18aed0a');