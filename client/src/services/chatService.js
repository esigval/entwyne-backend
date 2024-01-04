// chatService.js
import { API_BASE_URL } from '../../config.js';

export const sendMessageToServer = async (message, storyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/assistants/userInput`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, storyId }),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
