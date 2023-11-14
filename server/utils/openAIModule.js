// openai.js

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Initialize your OpenAI API parameters
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Ensure you have this in your .env file
const OPENAI_API_URL = 'https://api.openai.com/v1/audio/transcriptions';

// Function to transcribe audio
const transcribeAudio = async (filePath, language = 'en', model = 'whisper-1', responseFormat = 'json', temperature = 0) => {
  const form = new FormData();

  // Append the audio file, model, and other options to the form
  form.append('file', fs.createReadStream(filePath));
  form.append('model', model);

  // Optional parameters if provided
  if (language) form.append('language', language);
  form.append('response_format', responseFormat);
  form.append('temperature', temperature);

  try {
    const response = await axios.post(OPENAI_API_URL, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
    });

    // The response will contain the transcribed text
    return response.data;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

module.exports = {
  transcribeAudio
};
