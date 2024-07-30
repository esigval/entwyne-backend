import Prompts from '../../../models/promptModel.js';

const isValidPrompt = (prompt) => {
    // Check if the prompt is a valid JSON object and contains necessary fields
    if (typeof prompt !== 'object' || prompt === null) {
        return false;
    }

    const requiredFields = ['_id', 'order', 'prompt'];
    for (const field of requiredFields) {
        if (!prompt.hasOwnProperty(field)) {
            return false;
        }
    }

    return true;
};

const changePromptsBulk = async (data) => {
    console.log("Incoming Data:", data);
    try {
        // Parse data if it's a string
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        // Ensure data is an object
        if (typeof data !== 'object' || data === null) {
            throw new TypeError('Data should be an object');
        }

        // Extract taskpromptIds array from the incoming data
        const { taskpromptIds } = data;

        // Check if taskpromptIds is an array
        if (!Array.isArray(taskpromptIds)) {
            throw new TypeError('taskpromptIds should be an array');
        }

        // Sanitize and validate prompts
        const sanitizedPrompts = taskpromptIds.filter(isValidPrompt);
        console.log("Sanitized Prompts:", sanitizedPrompts);

        if (sanitizedPrompts.length !== taskpromptIds.length) {
            throw new Error('Some prompts are invalid or missing required fields');
        }

        const updatedPrompts = await Prompts.updatePrompts(sanitizedPrompts);
        const message = `${sanitizedPrompts.length} tasks have been updated. Please check the updated tasks to see the changes and let me know if you need any other changes.`;
        console.log("Message", message);
        return { updatedPrompts, message };
    } catch (error) {
        console.error("Error in changePromptsBulk:", error);
        throw error;
    }
};

export default changePromptsBulk;