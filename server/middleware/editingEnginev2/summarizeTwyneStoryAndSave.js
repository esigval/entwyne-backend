import twyneSummarizingFunction from '../editingEnginev2/llms/summarizeTwyne.js';
import Twyne from '../../models/twyneModel.js';

const summarizeTwyneStoryAndSave = async (twyneId, threadId) => {
    try {
        // Assuming threadId is available or retrieved earlier // Example: Use twyneId as threadId or adjust as needed
        const triggerLength = 5; // Example trigger length for summarization

        // Run the summarizing function
        const summaryResult = await twyneSummarizingFunction(threadId, triggerLength);
        
        // Check if the summary was successful
        if (summaryResult && !summaryResult.error) {
            // Assuming the summary is stored in a property named 'summary'
            const twyneSummary = summaryResult.twyneSummary;

            // Save the summary to the Twyne using the update function
            await Twyne.update(twyneId, { twyneSummary: twyneSummary });

            console.log('nhf');
            return twyneSummary;
        } else {
            console.error('Failed to generate summary:', summaryResult.error || 'Unknown error');
        }
    } catch (error) {
        console.error('Error in summarizing and saving Twyne story:', error);
    }
};

export default summarizeTwyneStoryAndSave;

