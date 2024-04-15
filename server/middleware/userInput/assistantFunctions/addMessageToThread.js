import { openai } from '../../../services/openAiAssistant.js';

export const addMessageToThread = async (message, threadId) => {
    const response = await openai.beta.threads.messages.create(
        threadId,
        {
            role: "user",
            content: message
        }
    );

    return response;
};
