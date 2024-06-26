import { openai } from '../../../services/openAiAssistant.js';

export const checkRun = async (threadId, runId) => {
  try {
    const runStatus = await openai.beta.threads.runs.retrieve(
      threadId,
      runId
    );
    return runStatus;
  } catch (error) {
    console.error("Error in checkRun:", error);
    // Handle error appropriately
  }
};

export const submitToolOutputs = async (threadId, runId, callIds) => {
  const run = await openai.beta.threads.runs.submitToolOutputs(
      threadId,
      runId,
      {
          tool_outputs: [
              {
                  tool_call_id: callIds[0], // Assuming callIds is an array
                  output: "true",
              },
          ],
      }
  )
  return run;
};



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

export const addAssistantMessageToThread = async (message, threadId) => {
  const response = await openai.beta.threads.messages.create(
    threadId,
    {
      role: "assistant",
      content: message
    }
  );

  return response;
};



const getLastMessageId = async (threadId) => {
  try {
    const newMessages = await openai.beta.threads.messages.list(
      threadId, {
      limit: 10,
      order: 'desc'
    }
    );

    return newMessages.body.first_id;
  } catch (error) {
    throw new Error('Error fetching recent message ID:', error);
  }
};

export const retrieveNewMessagesFromThread = async (threadId) => {
  let lastMessageId = await getLastMessageId(threadId);
  let message;

  while (true) {
    message = await openai.beta.threads.messages.retrieve(
      threadId,
      lastMessageId
    );

    if (message.role === 'assistant') {
      // Check if the message content is empty
      if (message.content && message.content.length > 0 && message.content[0].text && message.content[0].text.value) {
        return message.content[0].text.value;
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
        lastMessageId = await getLastMessageId(threadId); // Refresh the last message ID
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
      lastMessageId = await getLastMessageId(threadId); // Refresh the last message ID
    }
  }
};