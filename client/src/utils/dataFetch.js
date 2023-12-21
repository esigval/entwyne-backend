// dataFetch.js
import axios from 'axios';

export const fetchStories = async () => {
  try {
    const response = await axios.get('http://192.168.0.137:3001/v1/stories');
    return response.data;
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw error;
  }
};

export const fetchPrompts = async () => {
  try {
    const response = await axios.get('http://192.168.0.137:3001/v1/prompts');
    return response.data;
  } catch (error) {
    console.error('Error fetching prompts:', error);
    throw error;
  }
};

export const fetchTwynes = async () => {
  try {
    const response = await axios.get('http://192.168.0.137:3001/v1/twynes');
    return response.data;
  } catch (error) {
    console.error('Error fetching twynes:', error);
    throw error;
  }
};