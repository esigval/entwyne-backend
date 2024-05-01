import OpenAI from 'openai';
import NarrativeBlock from '../../../models/narrativeBlockModel.js';
import dotenv from "dotenv";
import generateSubDivisionPrompt from '../promptScripts/subdivisionScriptPrompt.js';
import parseLLMResponseToJson from './parseLLMResponseToJson.js';
import { ObjectId } from 'mongodb';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const confirmationAgent = async (prompt) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content: "You are my data checking GPT, your job is to take a list of narrative blocks and check if they are valid, and if not, get the valid ones corrected"
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 2000,
    temperature: 0,
  });

  return JSON.parse(completion.choices[0].message.content.trim());
};


const generateRewritePrompt = (narrativesToRewrite, allowedTypes) => {
  let prompt = "Review the following narrative blocks that have been marked as invalid because their types do not match the allowed types. Correct the types where possible and provide the output in a JSON format, including the original index and the updated block. Allowed types are: " + allowedTypes.join(", ") + ".\n\n";

  narrativesToRewrite.forEach(narrative => {
      prompt += `Index: ${narrative.index}, Type: ${narrative.block.type.replace('_Invalid', '')}, Name: ${narrative.block.name}, Duration: ${narrative.block.duration || 'N/A'}\n`;
  });

  prompt += "\nFor each of the narratives above, with a unique index, process the blocks in the following JSON format:\n";
  prompt += `Example: [{"index": 0, "block": {"type": "Corrected Type", "name": "Narrative Name", "Duration": "Original Duration", "Description": "Original Description"  }}]`;
console.log('Prompt:', prompt);
  return prompt;
};

export const validateAndRewriteNarratives = async (rawNarrative) => {
  const narrativeBlocks = await NarrativeBlock.list();
  const allowedTypes = narrativeBlocks.map(block => block.type);  // Using 'type' as the key

  // Simple array of just the type names
  const allowedBlocks = narrativeBlocks.map(block => block.type);

  const narrativesToRewrite = [];
  const validatedNarratives = rawNarrative.map((block, index) => {
      if (!allowedTypes.includes(block.type)) {
          narrativesToRewrite.push({ index, block: {...block, type: `${block.type}_Invalid`}});  // Including the index
          return {...block, type: `${block.type}_Invalid`};
      }
      return block;
  });

  return { validatedNarratives, narrativesToRewrite, allowedBlocks };
};
async function validateNarratives(narrativeData) {
  if (typeof narrativeData === 'string') {
    narrativeData = JSON.parse(narrativeData);
}
  const { validatedNarratives, narrativesToRewrite, allowedBlocks } = await validateAndRewriteNarratives(narrativeData.rawNarrative);

  if (narrativesToRewrite.length > 0) {
    const prompt = generateRewritePrompt(narrativesToRewrite, allowedBlocks);
    const correctedNarratives = await confirmationAgent(prompt);
    const updatedNarratives = reinsertNarratives(narrativeData.rawNarrative, correctedNarratives);
    console.log('Corrected Narratives:', JSON.stringify(correctedNarratives, null, 2));
    console.log('Updated Narratives:', JSON.stringify(updatedNarratives, null, 2));
    return validateNarratives({ ...narrativeData, rawNarrative: updatedNarratives });
  } else {
    console.log('All narratives are valid and processed:', JSON.stringify(validatedNarratives, null, 2));
    return { ...narrativeData, rawNarrative: validatedNarratives }; // Return the whole narrative object
  }
}

const reinsertNarratives = (originalNarratives, correctedNarratives) => {
  correctedNarratives.forEach(narrative => {
    originalNarratives[narrative.index] = narrative.block; // Correct and replace the narrative at the original index
  });
  return originalNarratives;
};


export default validateNarratives;


  
  
