import {openai} from '../services/openAiAssistant.js';


async function fetchAndSummarizeThread(threadId) {
    try {
        // Fetch the list of messages from the thread
        const threadMessagesResponse = await openai.beta.threads.messages.list(threadId, { order: 'asc' });

        // Extract and summarize the messages
        const threadHistory = summarizeThreadMessages(threadMessagesResponse.data);
        console.log('threadHistory:', threadHistory);

        return threadHistory;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function summarizeThreadMessages(messages) {
    return messages.map(message => {
        const textContent = message.content.find(content => content.type === "text");
        return textContent ? `${message.role}: ${textContent.text.value}` : '';
    }).join('\n'); // Joining each message with a newline for readability
}

fetchAndSummarizeThread(`thread_YdrifOEpGbNuhkoYM40K5pdd`);
