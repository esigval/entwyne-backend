import { openai } from '../../services/openAiAssistant.js';
import { modelVersion35 } from '../../config.js';
import fetchAndSummarizeThread from '../storylineEngine/fetchAndSummarizeThread.js';


async function directorReviewAssistant(instructions, threadId, prompts) {
    
    try {
        const threadHistory = await fetchAndSummarizeThread(threadId); // Implement this function
        const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: instructions +`//thread history//`+ threadHistory + `//prompts//`+ prompts }],
        model: modelVersion35,
      });
  
      let content = completion.choices[0].message.content;
      console.log('content:', completion.choices[0].message.content)
  
      // Find the index where the JSON array starts
      const jsonStartIndex = content.indexOf('[');
      if (jsonStartIndex === -1) {
        throw new Error("No JSON array found in the content.");
      }
  
      // Extract the JSON part
      content = content.substring(jsonStartIndex);
  
      // Remove potential trailing characters after the JSON array
      const jsonEndIndex = content.lastIndexOf(']');
      if (jsonEndIndex === -1) {
        throw new Error("Invalid JSON format.");
      }
  
      content = content.substring(0, jsonEndIndex + 1);
  
      // Parse the string to an array
      const parsedContent = JSON.parse(content);
  
      return parsedContent; // This will be an array
    } catch (error) {
      console.error('Error in transformStoryToPrompts:', error);
      throw error;
    }
  }
  
  export default directorReviewAssistant;