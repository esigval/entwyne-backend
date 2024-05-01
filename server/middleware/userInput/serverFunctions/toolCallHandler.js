import Twyne from '../../../models/twyneModel.js'; // Import the Twyne model
import Story from '../../../models/storyModel.js'; // Import the Story model

function handleToolCallResults(toolCallResults, threadId, twyneId, storyId) {
    for (let result of toolCallResults) {
        switch (result.toolCallName) {
            case 'makeTwynes':
                console.log('Handling makeTwynes:', result);
                Story.deleteThreadId(storyId);
                return result;
            case 'createRawNarrative':
                console.log('Handling createRawNarrative:', result);
                Twyne.deleteThreadId(twyneId);
                return result;
            case 'changeNarrative':
                console.log('Handling changeNarrative:', result);
                Twyne.deleteThreadId(twyneId);
                return result;
            default:
                console.log('Unknown type:', result);
                break;
        }
    }
}

export default handleToolCallResults;