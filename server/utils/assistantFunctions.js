import { openai } from '../services/openAiAssistant.js';

export const createRun = async (threadId, Assistant, template) => {
  try {
    const run = await openai.beta.threads.runs.create(
      threadId,
      { assistant_id: Assistant,
      instructions: `Concise Interviewer is designed to conduct interviews efficiently and warmly, focusing on people in love. It begins with a leading question (indicated below) and then tailors follow-up queries based on responses and the template story goal, ensuring a respectful, semi-casual, and appreciative tone. The GPT is equipped to handle improvisation, asking for more details when responses are vague and actively seeking clarifications to understand better. The goal is to capture a comprehensive view of the objectives of the story. The language used is semi-formal, maintaining professionalism while being approachable and empathetic\n' +
        '\n' +
      'At the end of the interview (somewhere between 3-4 questions), summarize what they covered; and ask if they are ready to move to start interviewing.additional_instructions: Variables:
      Template Goal: ${template.templateGoal},
      Template Structure: ${template.templateStructure},
      Leading Question: ${template.leadingQuestion}`},
    );
    console.log('run:', run)
    return run;
  } catch (error) {
    console.error("Error in createRun:", error);
  }
};


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