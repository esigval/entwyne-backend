import { openai } from '../../../services/openAiAssistant.js';

async function listMessages(threadId) {
  const threadMessages = await openai.beta.threads.messages.list(
    threadId
  );
  let messageHistory = []; // Initialize an empty array to store message history

  threadMessages.data.forEach(message => {
    // Check if message.content is an array and not empty
    if (Array.isArray(message.content) && message.content.length > 0) {
      message.content.forEach(contentItem => {
        // Adjusted to match the new structure where content is an array
        if (contentItem.type === 'text' && contentItem.text && contentItem.text.value) {
          messageHistory.push(contentItem.text.value); // Push the value to the messageHistory array
        }
      });
    }
  });

  // Return both the message history and the length of the thread
  return {
    messageHistory,
    threadLength: threadMessages.data.length // The total number of messages in the thread
  };
}

export default listMessages;

const response = await listMessages('thread_kpDcCUXi5XSKxKL9t7oJ9PuB');
console.log(response);