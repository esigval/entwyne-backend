// chatService.js
import { API_BASE_URL } from '../../config.js';
import { useNavigation } from '@react-navigation/native'

export const sendMessageToServer = async (message, storyId, templateName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/assistants/userInput`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, storyId, templateName }),
    });
    const responseData = await response.json();

    if (responseData.message === 'NavigatetoCapture') {
      navigation.navigate('TwyneLoadingScreen');
    }
    
    return responseData;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
