import Twyne from '../../../models/twyneModel.js'; // Import the Twyne model
import Story from '../../../models/storyModel.js'; // Import the Story model

function handleToolCallResults(toolCallResults, threadId, twyneId, storyId) {
    if (!toolCallResults) {
        return [];
    }

    let handledResults = [];

    for (let result of toolCallResults) {
        if (!result || !result.toolCallName) {
            continue; // Skip if result is undefined or doesn't have the toolCallName property
        }

        switch (result.toolCallName) {
            case 'retrieval':
                console.log('Skipping retrieval:', result);
                continue; // Skip handling this tool call
            case 'makeTwynes':
                console.log('Handling makeTwynes:', result);
                handledResults.push(result);
                Story.deleteThreadId(storyId);
                break;
            case 'createRawNarrative':
                console.log('Handling createRawNarrative:', result);
                handledResults.push(result);
                Twyne.deleteThreadId(twyneId);
                break;
            default:
                console.log('Unknown type:', result);
                break;
        }
    }

    return handledResults;
}

export default handleToolCallResults;