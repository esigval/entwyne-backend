import { openai } from '../../../services/openAiAssistant.js';
import createTwynes from '../../twyneEngine/createTwynes.js';
import processNarrative from "../../editingEnginev2/mainDynamicStoryEngine.js";

let accumulatedArgs = {};

// Define a handler for processing specific tool call types
export function handleToolCallCreated(toolCall) {
    console.log('Tool Call Created:', toolCall);
    // Additional logic for initializing tracking or state
}

export function handleFunctionType(functionData, userId, twyneId, threadId) {
    if (!accumulatedArgs[threadId]) {
        accumulatedArgs[threadId] = "";
    }
    accumulatedArgs[threadId] += functionData.arguments;
    process.stdout.write(functionData.arguments);

    // Return the accumulatedArgs for this thread
    return accumulatedArgs[threadId];
}

export function handleToolCallDelta(delta, snapshot, threadId) {
    if (delta.type === 'function') {
        console.log('Tool Call Delta:', delta);
        if (!accumulatedArgs[threadId]) {
            accumulatedArgs[threadId] = "";
        }
        accumulatedArgs[threadId] += delta.function.arguments;   // Update the last known snapshot
    }
}

export async function handleToolCallDone(toolCall, snapshot, userId, twyneId, threadId, processNarrative, currentRunId, storyId) {
    try {
        console.log('Tool Call Done:', toolCall);
        if (accumulatedArgs[threadId]) {
            console.log('Processing final arguments for function tool call.');
            if (toolCall.function.name === 'createRawNarrative') {
                const output = await processNarrativeBasedOnArgs(accumulatedArgs[threadId], userId, twyneId, threadId, toolCall.id, currentRunId);
                return output;
            } else if (toolCall.function.name === 'makeTwynes') {
                const output = await processCreateTwynes(accumulatedArgs[threadId], userId, storyId, toolCall.id, threadId, currentRunId);
                return output;
            } else {
                console.error('Unknown function name:', toolCall.function.name);
            }
        } else {
            console.error('Invalid or incomplete final arguments data');
        }
    } catch (error) {
        console.error('Error in handleToolCallDone:', error);
    }
    finally {
        // Clear the accumulatedArgs for this thread
        delete accumulatedArgs[threadId];
    }
}

async function processCreateTwynes(args, userId, storyId, toolCallId, threadId, currentRunId) {
    try {
        const result = await createTwynes(args, userId, storyId);
        const output = await submitToolCallOutput(threadId, toolCallId, currentRunId, result);
        return output;
    } catch (error) {
        console.error('Error in processCreateTwynes:', error);
    }
}


// Make this function async to await the processing of the narrative
async function processNarrativeBasedOnArgs(args, userId, twyneId, threadId, toolCallId, currentRunId) {
    if (args) {

        // Assume processNarrative returns a Promise that resolves to the output needed for the tool call
        try {
            const narrativeOutput = await processNarrative(twyneId, args, userId);
            // Proceed to submit the tool call output after the narrative has been processed
            const output = await submitToolCallOutput(threadId, toolCallId, currentRunId, narrativeOutput);
            console.log('Narrative processed and tool call output submitted successfully.');
            return output;
        } catch (error) {
            console.error('Error processing narrative or submitting tool call output:', error);
        }
    } else {
        console.error('Invalid or incomplete final arguments data');
    }
}

// This function submits the tool call output and can remain unchanged
async function submitToolCallOutput(threadId, toolCallId, currentRunId, output) {
    const outputs = `We've completed the task! Here are the results: ${output}`

    try {
        await openai.beta.threads.runs.submitToolOutputs(threadId, currentRunId, {
            tool_outputs: [
                {
                    tool_call_id: toolCallId,
                    output: outputs
                }
            ]
        });

        console.log('Tool call output submitted successfully.');
        return outputs;
        
    } catch (error) {
        console.error('Error submitting tool call output:', error);
    }
    
}