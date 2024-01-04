import { openai } from '../services/openAiAssistant.js';

const getLastMessageId = async (threadId) => {
    try {
      console.log(`Fetching last message ID for threadId: ${threadId}`);
      const newMessages = await openai.beta.threads.messages.list(
        threadId, {
          limit: 10,
          order: 'desc'
        }
      );
  
      console.log('New messages fetched:', newMessages);
      console.log('Most Recent Message Id:', newMessages.body.first_id);
      return newMessages.body.first_id;
    } catch (error) {
      console.error('Error fetching recent message ID:', error);
    }
  };
  
  const retrieveNewMessagesFromThread = async (threadId) => {
    let lastMessageId = await getLastMessageId(threadId);
    let message;
  
    while (true) {
      console.log(`Retrieving message details for messageId: ${lastMessageId}`);
      message = await openai.beta.threads.messages.retrieve(
        threadId,
        lastMessageId
      );
  
      if (message.role === 'assistant') {
        console.log('Message is from assistant, waiting 1 second before requerying for content...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
        
        // Requery for the message
        console.log('Requerying for message content...');
        message = await openai.beta.threads.messages.retrieve(
          threadId,
          lastMessageId
        );
  
        if (message.content && message.content.length > 0 && message.content[0].text) {
          console.log('Message content:', message.content[0].text.value);
          return message.content[0].text.value;
        } else {
          console.log('Content not available, retrying...');
          lastMessageId = await getLastMessageId(threadId);
        }
      } else {
        console.log('Message is not from assistant, waiting 2 seconds and retrying...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
        lastMessageId = await getLastMessageId(threadId);
      }
    }
  };

  retrieveNewMessagesFromThread('thread_LceKsaMvfO3pLiGVo6d5NFaP');
  