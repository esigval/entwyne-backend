// dataFetch.js
import axios from 'axios';
import { API_BASE_URL } from '../../config.js';

export const fetchStories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/v1/stories`);
    console.log('response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw error;
  }
};

export const fetchPrompts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/v1/prompts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching prompts:', error);
    throw error;
  }
};

export const fetchTwynes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/v1/twynes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching twynes:', error);
    throw error;
  }
};