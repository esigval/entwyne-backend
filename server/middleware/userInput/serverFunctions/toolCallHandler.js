import Twyne from '../../../models/twyneModel.js'; // Import the Twyne model
import Story from '../../../models/storyModel.js'; // Import the Story model

function handleToolCallResults(toolCallResults, threadId, twyneId, storyId) {
    // If toolCallResults is undefined, return null
    if (!toolCallResults) {
        return null;
    }

    let handledResults = []; // Array to store the handled results

    // Iterate over the toolCallResults array
    for (let result of toolCallResults) {
        // Check the type of each result and perform an action accordingly
        switch (result.toolCallName) {
            case 'makeTwynes':
                // Perform action for makeTwynes
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
                // Perform default action for unknown types
                console.log('Unknown type:', result);
                break;
        }
    }

    return handledResults; // Return the handled results
}

export default handleToolCallResults;