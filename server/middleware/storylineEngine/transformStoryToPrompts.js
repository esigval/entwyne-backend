import { openai } from '../../services/openAiAssistant.js';
import { modelVersion } from '../../config.js';

async function transformStoryToPrompts(instructions, threadHistory, templateParts) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: instructions + threadHistory + templateParts }],
      model: modelVersion,
    });

    let content = completion.choices[0].message.content;

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

export default transformStoryToPrompts;
