import storyEngine from '../storylineEngine/storyEngine.js'; // Replace './storyEngine' with the actual path to the module
import { submitToolOutputs } from '../../utils/assistantFunctions.js'; // Replace './submitToolOutputs' with the actual path to the module

const processInBackground = async (threadId, run, finalRunStatus, templateName, storyId, instructions) => {
    try {
        const toolCallId = finalRunStatus.required_action.submit_tool_outputs.tool_calls[0].id;
        console.log('tool_call_id:', toolCallId);
        const results = await storyEngine(instructions, storyId, threadId, templateName);
        console.log('storyEngine Successful.', results);
        const toolOutputs = submitToolOutputs(threadId, run.id, [toolCallId]);
        console.log('Tool outputs submitted', toolOutputs);

    } catch (error) {
        console.error('Error in background process:', error);
        // Handle any errors that occur in the background process
    }
}

export default processInBackground;